const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const db = require('../../schemas');
const SALT_WF = 10;
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
    let studentId = req.params.stid;
    if (studentId !== undefined) {
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

module.exports = router;