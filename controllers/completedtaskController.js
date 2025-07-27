const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.completedtask = async function(req, res) {
    try {
        const tasks = await Dashboard.find({ completed: true });
        const user = await User.findOne({ email: "ankitvis609@gmail.com" });

        return res.render('completedtask', {
            title: "Completed Tasks",
            name: user?.name || "Guest",
            dashboard: tasks
        });
    } catch (err) {
        console.error('❌ Error loading completed tasks:', err);
        return res.status(500).send("Internal Server Error");
    }
};

