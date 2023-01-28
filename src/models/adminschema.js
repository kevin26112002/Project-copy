const mongoose = require('mongoose');

const adminloginSchema = new mongoose.Schema({
    Email: {
        type: String,
        enum: ["20200025000@gmail.com"]
    },
    Password: {
        type: String,
        // enum: ["123"]
    }
});

const adminLogin = new mongoose.model('adminLogin', adminloginSchema);

module.exports = adminLogin;