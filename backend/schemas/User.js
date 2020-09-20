const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    student_id: Number,
    username: {type:String, unique:true},
    password: String,
    isAdmin: Boolean,
    isBlocked:Boolean
});

mongoose.model('User',UserSchema);
module.exports = mongoose.model('User');