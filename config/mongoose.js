const mongoose = require('mongoose');

mongoose.connect(process.env.mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "❌ MongoDB connection error:"));
db.once('open', () => {
    console.log("✅ Connected to MongoDB!");
});

module.exports = db;

