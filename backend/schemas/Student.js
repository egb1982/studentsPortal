const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    student_id: {type:Number, unique:true, required:true, minlength:6},
    email: String,
    name: String,
    surname: String,
    leave: {type:Boolean, default: false}
});

mongoose.model('Student',StudentSchema);
module.exports = mongoose.model('Student');