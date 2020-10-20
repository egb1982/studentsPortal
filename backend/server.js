const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const db = require('./db');

const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/uploads'),
    filename (req, file, callback) {
        callback(null,new Date().getTime() + path.extname(file.originalname));
    }
})

app.use(cors());
app.use(multer({storage}).single('document'));

const AuthController = require('./api/auth/authController');
app.use('/api/auth',AuthController);

const AdminController = require('./api/admin/adminController');
app.use('/api/admin',AdminController);

const StudentController = require('./api/student/studentController');
app.use('/api/student',StudentController);

app.get('/download/:file',(req,res)=>{
    const file = path.resolve(__dirname,`./public/uploads/${req.params.file}`);
    res.download(file);
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (req,res) => {
    console.log(`Server listening at port ${PORT}`);
});

