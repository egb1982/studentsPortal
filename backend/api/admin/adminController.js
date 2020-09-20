const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const User = require('../../schemas/User');
const Student = require('../../schemas/Student');
const Post = require('../../schemas/Post');
const { PassThrough } = require('nodemailer/lib/xoauth2');

let transport = nodemailer.createTransport({
    host:'smtp.mailtrap.io',
    port:2525,
    auth: {
        user: '92e9d3a0689277',
        pass: '09d938ad5632dd' 
    }
})

sendRegisterMessage = (email, name, surname, studentId) => {
    const message = {
        from: 'admin@university.com',
        to: email,
        subject: 'You are enrolled successfully',
        html: '<h1> Welcome to the University </h1>'
        +'<p> Dear ' + name + ' ' + surname +'. <br>'
        +'Your applycation has been accepted and you have been enrolled to our university. <br>'
        +'To access to the Univesity\'s Portal, you have to <a href="http://localhost:4200/register/'+studentId+'">follow this link</a> and register.<br>'
        +'You will need your <b>student id</b> to acomnplish the registration process, which is: <h4>' + studentId +'</h4><br>'
        +'Best regards, <br> The Administration.</p>'
    }    

    transport.sendMail(message, (err, info) => {
        if (err) { console.log(err) } 
        else { console.log(info); }
    });
}

// router.get('/registerEmail',(err,res) => {
//     const message = {from: 'admin@university.com',
//     to: 'egb@students.es',
//     subject: 'You are enrolled successfully',
//     html: '<h1> Welcome to the University </h1>'}
//     transport.sendMail(message,(err,info) => {
//         if (err) { console.log(err) } 
//         else { console.log(info); }
//     });
// });

// GET ALL OR SPECIFIC STUDENT
router.get('/students/:id?',(req,res) => {
    const filter = (req.params.id !== undefined) ? {student_id : req.params.id}:{};

    Student.find(filter, (err,students) => {
        if (err) return res.status(500).send('Error getting the Student(s)');
        res.status(200).send(students);
    });  
});

// ENROL A NEW STUDENT
router.post('/createStudent', (req,res) => {

    Student.create({student_id: req.body.studentId,
                    name : req.body.name,
                    surname : req.body.surname,
                    email : req.body.email,
                    leave : false}, (err,student) => {
                        if(err) return res.status(500).send('Error on creating a new Student.');
                        res.status(201).send(student);
                        sendRegisterMessage(req.body.email, req.body.name,req.body.surname, req.body.studentId);
                    });
}); 

// BLOCK STUDENT ACCESS TO THE PORTAL
router.put('/blockUser/:id',(req,res) => {
    User.findOneAndUpdate({student_id:req.params.id},{isBlocked:true},(err,user) => {
        if (err) return res.status(500).send('Error blocking user');
        res.status(200).send(user);
    });
});

// BLOCK STUDENT ACCESS TO THE PORTAL
router.put('/unblockUser/:id',(req,res) => {
    User.findOneAndUpdate({student_id:req.params.id},{isBlocked:false},(err,user) => {
        if (err) return res.status(500).send('Error unblocking user');
        res.status(200).send(user);
    });
});

// DELETE STUDENT AND USER
router.delete('acceptLeave/:id',(req,res) => {
    Student.findOneAndDelete({student_id:req.params.id},(err,student) => {
        if (err) return res.status(500).send('Error deleting Student');
        User.findOneAndDelete({student_id:req.params.id},(err,user) => {
            res.status(204).send("student removed");
        });
    });
});

module.exports = router;