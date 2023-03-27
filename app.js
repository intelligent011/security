//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//require mongoose
const mongoose = require("mongoose");
//encrypt
const encrypt = require("mongoose-encryption");



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

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(function(){
            res.render("secrets")})
        .catch(function(err){
            console.log(err)})


});

//lets create post method for login using existing users data
app.post("/login", function(req, res) {
    const username = req.body.username; 
    const password = req.body.password;
    //lets check if current user exists
    User.findOne({email: username})
        .then(function(foundUser) {
            if (foundUser.password === password) {
                res.render("secrets")
            }

        })
        .catch(function(err) {
            console.log(err)
        })
})



app.listen(3000, function() {
    console.log("Server started on port 3000.")
})