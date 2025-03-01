const express = require("express");
const path = require('path');
const fs = require("fs");
const hbs = require("hbs");
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
// const pdfkit = require('pdfkit');
const { timeStamp } = require("console");
var cors = require('cors');
app.use(cors('*'));
var nm = require('nodemailer');
mongoose.set('strictQuery', true);
const port = 8000;

// get the mongoose connection conn.js file
require("./db/conn");


// For get the Register schema which is for complaint form
const Complaint = require("./models/complaint");

// For get the Login schema which is for login form
const Login = require("./models/loginSchema");
const adminlogin = require("./models/adminschema");


// const staticPath = path.join(__dirname, "../img/Aadit.jpg");
// app.use(express.static(staticPath));

// set the view engine as a handlebars(hbs)
const engine = app.set("view engine", "hbs");

// Get the path of views directory
const templatePath = path.join(__dirname, "../templates/views/");
app.set("views", templatePath);

// Get the path of partials directory
const partialPath = path.join(__dirname, "../templates/partials/");

// Getting the partials as hbs
hbs.registerPartials(partialPath);


app.use(express.json());
// For get the data in mongodb compass
app.use(express.urlencoded({ extended: false }));


app.use(express.static(__dirname))



app.get('/',(req, res) => {

    res.render('login1.hbs');
});


var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

let transporter = nm.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    
    auth: {
      user: 'kevinpaghadal8@gmail.com',
      pass: 'orzlqbzozgcbzutn',
    }
    
});
let kevin;
    
app.post('/send',async(req, res)=>{
    kevin = req.body.Email;
    try {
        const loginUser = new Login({
            Email: req.body.Email,
        });
        const loginSuccess = await loginUser.save();
        // res.status(201).render("register");
    }
    catch (e) {
        res.status(400).send("Login detail not fulfilled");
    }

     // send mail with defined transport object
    var mailOptions={
        to: req.body.Email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('login2');
    });
});

app.post('/verify',async(req,res)=>{

    if(req.body.otp==otp){
        try {
            Complaint.find({Email:req.query.Email},(err,complaints)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render('client',{complaints: complaints});
                }
            })
        } catch (error) {
             console.log(error);
            }
        
    }
    
    else{
        res.render('otp',{msg : 'otp is incorrect'});
    }
});  

app.post('/resend',function(req,res){
    var mailOptions={
        to: email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('otp',{msg:"otp has been sent"});
    });

});











// For main file: index.hbs
// app.get('/', (req, res) => {
//     res.render("login");
// });

// For login: login.hbs
app.get('/login', (req, res) => {
    res.render("login");
});

// For query file: query.hbs
app.get('/register', (req, res) => {
    res.render("register");
});


app.get('/adminlogin', (req, res) => {
    res.render("adminlogin");
});

app.get('/admin', (req, res) => {

    Complaint.getAllComplaints((err, complaints) => {
        if (err) throw err;

        res.render('admin', {

            complaints: complaints
        });
    });
    
});

app.get('/search', (req, res) => {
    try {
        Complaint.find({$or:[{Branch:{'$regex':req.query.dsearch}},{Date:{'$regex':req.query.dsearch}}]},(err,complaints)=>{
            if(err){
                console.log(err);
            }else{
                res.render('admin',{complaints: complaints});
            }
        })
} catch (error) {
   console.log(error);
}
});
// app.get('/delete', (req, res) => {
//     try {
//         Complaint.deleteOne((err,complaints)=>{
//             if(err){
//                 console.log(err);
//             }else{
//                 res.render('admin',{complaints: complaints});
//             }
//         })
// } catch (error) {
//    console.log(error);
// }
// });
app.get('/client', (req, res) => {
    try {
        Complaint.find({Email:kevin},(err,complaints)=>{
            if(err){
                console.log(err);
            }else{
                res.render('client',{complaints: complaints});
            }
        })
} catch (error) {
   console.log(error);
}
});







// For login file  --> It opens the login.hbs File
app.post('/login1', async (req, res) => {
    // const myData = new Login(req.body);
    // myData.save().then(() => {
    //     res.render("register")
    // }).catch(() => {
    //     res.status(400).send("Please fill all the detail correctly..!!")
    // });

    try {
        const loginUser = new Login({
            Email: req.body.Email,
        });
        const loginSuccess = await loginUser.save();
        res.status(201).render("register");
    }
    catch (e) {
        res.status(400).send("Login detail not fulfilled");
    }
});


app.post('/registerComplaint', (req, res) => {
    const Firstname = req.body.Firstname;
    const Lastname = req.body.Lastname;
    const Email = req.body.Email;
    const Branch = req.body.Branch;
    const Query = req.body.Query;
    const Computer = req.body.Computer;
    const OtherQuery = req.body.OtherQuery;
    const Phone = req.body.Phone;
    const Note = req.body.Note;


    const postBody = req.body;
    console.log(postBody);
    let errors = false;
    if (errors) {
        res.render('complaint', {
            errors: errors
        });
    } else {
        const newComplaint = new Complaint({
            Firstname: Firstname,
            Lastname: Lastname,
            Email: Email,
            Branch: Branch,
            Query: Query,
            Computer: Computer,
            OtherQuery: OtherQuery,
            Phone: Phone,
            Note: Note,
        });
        console.log("kjshkhf");
        Complaint.registerComplaint(newComplaint, (err, complaint) => {
            if (err) throw err;
            console.log("hfkshk");
            res.send("thank you for registering your newComplaint");
        });
    }
});

app.post("/adminlogin", async (req, res) => {
    try {
        const adminloginUser = new adminlogin({
            Email: req.body.Email,
            Password: req.body.Password
        });
        const adminloginSuccess = await adminloginUser.save();
        Complaint.getAllComplaints((err, complaints) => {
            if (err) throw err;

            res.render('admin', {

                complaints: complaints
            });
        });
    }
    catch (e) {
        res.status(400).send("Login detail not fulfilled");
    }
})




// Start the server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});