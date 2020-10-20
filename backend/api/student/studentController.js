const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const db = require('../../schemas');

//SEND LEAVE REQUEST
router.put('/requestLeave/:id',(req,res)=>{
    db.Student.findOneAndUpdate({student_id:req.params.id},{leave:true},(err,student) => {
        if (err) return res.status(500).send('Error requesting leave');
        res.status(200).send(student);
    });
});
router.get('/getPosts',(req,res) => {
    db.Post.find({},(err,posts) => {
        if (err) return res.status(500).send('Error getting posts');
        res.status(200).send(posts);
    }).sort({_id:-1});
});

//UPDATE OWN DATA
router.put('/updateStudent',(req,res)=>{
    console.log(req.body);
    db.Student.findOneAndUpdate({student_id:req.body.student_id},
        { student_id:req.body.student_id,
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email
        },(err,student) => {
        if (err) return res.status(500).send('Error updating student');
        res.status(200).send(student);
    });
});

module.exports = router;