const express = require('express');
const port = process.env.PORT || 4000;
const path = require('path');
require('dotenv').config();

// اتصال قاعدة البيانات
const db = require('./config/mongoose');

// موديلات
const User = require('./models/register');
const Dashboard = require('./models/dashboard');

const app = express();

// الراوتس
const routes = require('./routes');
app.use('/', routes);

// إعدادات الـ view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// الميدل وير
app.use(express.urlencoded());
app.use(express.static('assets'));

// تسجيل المستخدم
app.post('/register', async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });
        console.log("Successfully Created user!", user);
        res.redirect('/dashboard');
    } catch (err) {
        console.log("Error Creating user!!", err);
        res.status(500).send("Error Creating user!!");
    }
});

// إضافة مهمة
app.post('/addtask', async (req, res) => {
    try {
        const newTask = await Dashboard.create({
            task: req.body.task,
            date: req.body.date,
            description: req.body.description,
            time: req.body.time,
            categoryChoosed: req.body.categoryChoosed
        });
        console.log("Successfully Created Task!", newTask);
        res.redirect('back');
    } catch (err) {
        console.log("Error Creating Task!!", err);
        res.redirect('back');
    }
});

// إنهاء المهمة
app.get('/complete-task', async (req, res) => {
    try {
        const updated = await Dashboard.findByIdAndUpdate(req.query.id, { completed: true });
        console.log("Successfully Completed Task!", updated);
        res.redirect('back');
    } catch (err) {
        console.log("Error Completing Task!!", err);
        res.redirect('back');
    }
});

// حذف المهمة
app.get('/delete-task', async (req, res) => {
    try {
        const deleted = await Dashboard.findByIdAndDelete(req.query.id);
        console.log("Successfully Deleted Task!", deleted);
        res.redirect('back');
    } catch (err) {
        console.log("Error Deleting Task!!", err);
        res.redirect('back');
    }
});

app.listen(port, (err) => {
    if (err) {
        console.log(`Error: ${err}`);
    }
    console.log(`✅ Server is running on port ${port}`);
});

