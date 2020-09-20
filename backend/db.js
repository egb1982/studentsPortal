var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost:5000/studentportal';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log(' --||-- Mongoose connected to ' + dbURI);
  });
  
mongoose.connection.on('error',function (err) {
  console.log( ' --|X|-- Mongoose connection error: ' + err);
});
  
mongoose.connection.on('disconnected', function () {
  console.log(' --\ /-- Mongoose disconnected');
});

