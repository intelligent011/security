//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//require mongoose for DB
const mongoose = require("mongoose");



//encrypt

//hashing md5
//const md5 = require("md5");

//hashing bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

//connect DB
mongoose.connect("mongodb://0.0.0.0:27017/userDB");
//new schema
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//key for encryption
//transfered secret key to env file



//new model
const User = new mongoose.model("User", userSchema);




//home route
app.get("/", function(req, res) {
    res.render("home");
});

//login route
app.get("/login", function(req, res) {
    res.render("login");
});


//register route, for post method use DB schema to create new user
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
    
        newUser.save()
            .then(function(){
                res.render("secrets")})
            .catch(function(err){
                console.log(err)})
    });
});

//lets create post method for login using existing users data
app.post("/login", function(req, res) {
    const username = req.body.username; 
    const password = req.body.password;
    //lets check if current user exists
    User.findOne({email: username})
        .then(function(foundUser) {
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if (result === true) {
                    res.render("secrets")
                }
            });
        })
        .catch(function(err) {
            console.log(err)
        })
});



app.listen(3000, function() {
    console.log("Server started on port 3000.")
})