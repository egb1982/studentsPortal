const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    type: String,
    title: String,
    content: String
});

mongoose.model('Post',PostSchema);
module.exports = mongoose.model('Post');