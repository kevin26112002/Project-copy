const express = require("express");
const path = require('path');
const fs = require("fs");
const hbs = require("hbs");
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const pdfkit = require('pdfkit');
const { timeStamp } = require("console");
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
app.set("view engine", "hbs");

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

// For main file: index.hbs
app.get('/', (req, res) => {
    res.render("login");
});

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


// For login file  --> It opens the login.hbs File
app.post('/login', async (req, res) => {
    // const myData = new Login(req.body);
    // myData.save().then(() => {
    //     res.render("register")
    // }).catch(() => {
    //     res.status(400).send("Please fill all the detail correctly..!!")
    // });

    try {
        const loginUser = new Login({
            Email: req.body.Email,
            Password: req.body.Password
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
            res.render("index");
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






app.get('*', (req, res) => {
    res.status(404).render("pageNotFound");
});


// Start the server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});