const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const db = require('../../schemas');
const SALT_WF = 10;

let transport = nodemailer.createTransport({
    host:'smtp.mailtrap.io',
    port:2525,
    auth: {
        user: '92e9d3a0689277',
        pass: '09d938ad5632dd' 
    }
})

resetPasswordMessage = (studentId, password) => {

    db.Student.findOne({student_id:studentId},(err,student) => {
        if (err) return res.status(500).send('Error finding student.')
        const message = {
            from: process.env.SENDER,
            to: student.email,
            subject: 'Students portal password reset',
            html: '<h1>Your Password has ben reset</h1>'
            +'<p> Dear ' + student.name + ' ' + student.surname +'. <br>'
            +'Your password has been successfully changed to a random password: <br>'
            +'<strong>'+password+'</strong> <br>'
            +'Try to access to the Univesity\'s Portal by <a href="'+process.env.PROD_HOST+'/login">following this link</a>.<br>'
            +'Best regards, <br> The Administration.</p>'
        }    
        transport.sendMail(message, (err, info) => {
            if (err) { console.log(err) } 
            else { console.log(info); }
        });
    });
}

/* For Creating the Admin first time */
router.post('/createAdminUser',(req,res) => {
    const hashedPassword = bcrypt.hashSync(config.adminPwd,SALT_WF);
    db.User.create({
        student_id: 0,
        username: "admin",
        password: hashedPassword,
        isAdmin: true,
        isBlocked: false
    },(err,user) => {
        if (err) return res.status(500).send('There was an error registering the user.');

        const token = jwt.sign({id: user._id},config.secret,{expiresIn:3600});
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Headers','Origin, x-Requested-with,content-Type,Accept');
        res.status(201).send(user);
    });
});

router.get('/register/:stid', (req, res) => {
    
    if (req.params.stid !== undefined) {
        let studentId = req.params.stid;
        db.Student.findOne({student_id:studentId},(err,student) => {
            if (err) return res.status(500).send("There was an error validating the Student ID.");
            if (!student) return res.status(404).send("Student doesn't exist.");
            db.User.findOne({student_id:studentId},(err,user) => {
                if (err) return res.status(500).send("There was an error cheking the User");
                if (user) return res.status(200).send({isError:true,message:"This student has already an user binded."});
                res.status(200).send(student);
            });
        });
    } else {
        return res.status(404).send("No valid Student Id");
    }
});

router.post('/register', (req,res) => {
    
    const studentId = req.body.studentId;
    db.Student.findOne({student_id:studentId},(err,student) => {
        if (err) return res.status(500).send("There was an error validating the Student ID.");
        if (!student) return res.status(404).send("Student doesn't exist.");
        db.User.findOne({student_id:studentId},(err,user) => {
            if (err) return res.status(500).send("There was an error cheking the User");
            if (user) return res.status(200).send({isError:true,message:"This student has already an user binded."});

            const hashedPassword = bcrypt.hashSync(req.body.password,SALT_WF);
            db.User.create({
                student_id: studentId,
                username: req.body.username,
                password: hashedPassword,
                isAdmin: false,
                isBlocked: false
            },(err,user) => {
                if (err) return res.status(500).send('There was an error registering the user.');
                
                const token = jwt.sign({id: user._id},config.secret,{expiresIn:3600});
                res.setHeader('Access-Control-Allow-Origin','*');
                res.setHeader('Access-Control-Allow-Headers','Origin, x-Requested-with,content-Type,Accept');
                res.status(201).send(user);
            });
        });
    });    
});

router.post('/login', (req,res) => {
    db.User.findOne({ username: req.body.username },(err,user) => {
        if (err) return res.status(500).send({auth: false, token: null, msg: "There was an error retrieving the user."});
        if (!user) return res.status(404).send({auth: false, token: null, msg:"The user doesn't exist." });
        if (user.isBlocked) return res.status(404).send({auth: false, token: null, msg: "The user is blocked by the Administrator." });

        const isValidPassword = bcrypt.compareSync(req.body.password,user.password);
        if (!isValidPassword) return res.status(401).send({auth: false, token: null, msg: "The credentials doesn't match." }); 

        const token = jwt.sign({id: user._id}, config.secret,{expiresIn:3600});
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Headers','Origin, x-Requested-with,content-Type,Accept');
        res.status(200).send({auth: true, token: token });
    });
});

router.get('/studentDetails',(req, res) => {
    let token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({auth: false, message: "No token provided."});

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed token authentication'});

        db.User.findById(decoded.id, {password: 0}, (err, user) => {
            if (err) return res.status(500).send('User was not found');
            if (!user) return res.status(404).send('User was not found');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept');
            if (user.isAdmin) return res.status(200).send(user);         
            db.Student.findOne({student_id: user.student_id},(err,student) =>{
                if (err) return res.status(500).send('Student error');
                if (!student) return res.status(404).send('Student was not found');
                student.isAdmin = false;
                res.status(200).send(student);    
            });
        });
    });
});

// RESET PASSWORD
router.put('/resetPassword/:id',(req,res) => {
    const randomPass = Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(randomPass,SALT_WF);
    db.User.findOneAndUpdate({student_id:req.params.id},{password:hashedPassword},(err,user) => {
        if (err) return res.status(500).send('Error reseting password');
        resetPasswordMessage(req.params.id, randomPass);
        res.status(200).send(user);
    });
});

// CHANGE PASSWORD
router.put('/changePassword/:id',(req,res) => {
    const hashedNewPassword = bcrypt.hashSync(req.body.newPassword,SALT_WF);
    db.User.findOneAndUpdate({student_id:req.params.id},{password:hashedNewPassword},(err,user) => {
        if (err) return res.status(500).send('Error changing password');
        res.status(200).send(user);
    });
});

module.exports = router;