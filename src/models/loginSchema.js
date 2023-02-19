const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    Email: {
        type: String,
        enum: ["kevinpaghadal3@gmail.com","chintan@gmail.com"]
    }
  
});

const Login = new mongoose.model('Login', loginSchema);

module.exports = Login;