const Dashboard = require('../models/dashboard');
const User = require('../models/register');

module.exports.dashboard = async function(req, res) {
    try {
        const tasks = await Dashboard.find({});
        const user = await User.findOne({ email: "ankitvis609@gmail.com" });

        return res.render('dashboard', {
            title: "Dashboard",
            name: user?.name || "Guest",
            dashboard: tasks
        });
    } catch (err) {
        console.error('❌ Error loading dashboard:', err);
        return res.status(500).send("Internal Server Error");
    }
};

