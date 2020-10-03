const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db');

app.use(cors());

const AuthController = require('./api/auth/authController');
app.use('/api/auth',AuthController);

const AdminController = require('./api/admin/adminController');
app.use('/api/admin',AdminController);

const StudentController = require('./api/student/studentController');
app.use('/api/student',StudentController);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (req,res) => {
    console.log(`Server listening at port ${PORT}`);
});

