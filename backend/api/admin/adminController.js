const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const db = require('../../schemas');
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
        from: process.env.SENDER,
        to: email,
        subject: 'You are enrolled successfully',
        html: '<h1> Welcome to the University </h1>'
        +'<p> Dear ' + name + ' ' + surname +'. <br>'
        +'Your applycation has been accepted and you have been enrolled to our university. <br>'
        +'To access to the Univesity\'s Portal, you have to <a href="'+ process.env.PROD_HOST +'/register/'+studentId+'">follow this link</a> and register.<br>'
        +'You will need your <b>student id</b> to acomnplish the registration process, which is: <h4>' + studentId +'</h4><br>'
        +'Best regards, <br> The Administration.</p>'
    }    
    sendMail(message);
}

sendAcceptedLeaveMail = (student) => {
    const message = {
        from: process.env.SENDER,
        to:student.email,
        subject:"Your leave request has been ACCEPTED",
        html:'<h1> Notification of leave accepted </h1>'
        +'<p> Dear ' + student.name + ' ' + student.surname +'. <br>'
        +'Your request has been <strong>ACCEPTED</strong>. <br>'
        +'Your access to the University\'s Portal and all your data has been removed. <br>'
        +'Best regards, <br> The Administration.</p>'
    }
    sendMail(message);
}

sendRejectedLeaveMail = (student) => {
    const message = {
        from: process.env.SENDER,
        to:student.email,
        subject:"Your leave request has been REJECTED",
        html:'<h1> Notification of leave rejected </h1>'
        +'<p> Dear ' + student.name + ' ' + student.surname +'. <br>'
        +'Your request to leave has been rejected. <br>'
        +'Please, contact with the university\'s Administration to know the reasons. <br>'
        +'You still have plain access to your account. <br>'
        +'Best regards, <br> The Administration.</p>'
    }
    sendMail(message);
}

sendMail = (message) => {
    transport.sendMail(message, (err, info) => {
        if (err) { console.log(err) } 
        else { console.log(info); }
    });
}

router.post('/registerEmail',(req,res) => {
    const message = {from: process.env.SENDER,
    to: req.body.email,
    subject: 'You are enrolled successfully',
    html: '<h1> Welcome to the University </h1>'
    +'<p> Dear ' + req.body.name + ' ' + req.body.surname +'. <br>'
    +'Your applycation has been accepted and you have been enrolled to our university. <br>'
    +'To access to the Univesity\'s Portal, you have to <a href="'+ process.env.PROD_HOST +'/register/'+req.body.student_id+'">follow this link</a> and register.<br>'
    +'You will need your <b>student id</b> to acomnplish the registration process, which is: <h4>' + req.body.student_id +'</h4><br>'
    +'Best regards, <br> The Administration.</p>'
    }
    transport.sendMail(message,(err,info) => {
        if (err) return res.status(500).send('Error sending e-Mail'); 
        res.status(200).send(info);
    });
});

// GET ALL OR SPECIFIC STUDENT
router.get('/students/:id?',(req,res) => {

    if (req.params.id !== undefined) {
        db.Student.find({'student_id': req.params.id}, (err,students) => {
            if (err) return res.status(500).send('Error getting the Student');
            res.status(200).send(students);
        });
    } else {
        const query = {'$lookup':{from: 'users',localField: 'student_id',foreignField: 'student_id',as: 'user'}};    
        db.Student.aggregate([query],(err,students) => {
            if (err) return res.status(500).send('Error getting the Students');
            res.status(200).send(students);
        });
    }    
});

// ENROL A NEW STUDENT
router.post('/createStudent', (req,res) => {

    db.Student.create({student_id: req.body.studentId,
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
    db.User.findOneAndUpdate({student_id:req.params.id},{isBlocked:true},(err,user) => {
        if (err) return res.status(500).send('Error blocking user');
        res.status(200).send(user);
    });
});

// UNBLOCK STUDENT ACCESS TO THE PORTAL
router.put('/unblockUser/:id',(req,res) => {
    db.User.findOneAndUpdate({student_id:req.params.id},{isBlocked:false},(err,user) => {
        if (err) return res.status(500).send('Error unblocking user');
        res.status(200).send(user);
    });
});

// DELETE STUDENT AND USER
router.delete('/acceptLeave/:id',(req,res) => {
    db.Student.findOneAndDelete({student_id:req.params.id},(err,student) => {
        if (err) return res.status(500).send('Error deleting Student');
        db.User.findOneAndDelete({student_id:req.params.id},(err,user) => {
            if (err) return res.status(500).send('Error deleting User');
            res.status(204).send("student removed");
            sendAcceptedLeaveMail(student);
        });
    });
});

// REJECT STUDENT LEAVE
router.put('/rejectLeave/:id',(req,res) => {
    db.Student.findOneAndUpdate({student_id:req.params.id},{leave: false},(err,student) => {
        if (err) return res.status(500).send('Error Updating leave field of Student');
        res.status(200).send(student);
        sendRejectedLeaveMail(student);
    })
});

//PUBLISH NEW POST
router.post('/publish',(req,res) => {
    const docPath = req.file ? req.file.filename : "";
    db.Post.create({type:req.body.type,title:req.body.title,content:req.body.text,docPath:docPath}
                    ,(err,post) => {
                        if (err) return res.status(500).send('error saving the post');
                        res.status(201).send(post);
                    });
});

module.exports = router;