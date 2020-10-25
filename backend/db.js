const mongoose = require('mongoose');

//const dbURI = 'mongodb://localhost:5000/studentportal';
const dbURI = 'mongodb+srv://egb1982:egb1982@cluster0.xj6hy.mongodb.net/studentportal?retryWrites=true&w=majority'
mongoose.connect(dbURI,{ useNewUrlParser: true , useUnifiedTopology: true});

mongoose.connection.on('connected', function () {
    console.log(' --||-- Mongoose connected to ' + dbURI);
  });
  
mongoose.connection.on('error',function (err) {
  console.log( ' --|X|-- Mongoose connection error: ' + err);
});
  
mongoose.connection.on('disconnected', function () {
  console.log(' --\ /-- Mongoose disconnected');
});

