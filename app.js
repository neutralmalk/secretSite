//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});



//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.route("/login")
  .get(function(req,res){
    res.render("login");
  })
  .post(function(req,res){
    const userName = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: userName}, function(err, foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            res.render("secrets");
          }
        }
      }
    })
  });



app.route("/register")
  .get(function(req,res){
    res.render("register");
  })
  .post(function(req, res){
    const newUser = new User({
      email: req.body.username,
      password : md5(req.body.password)
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    })
  });


app.listen("3000", function(){
  console.log("Server successfully started on port 3000");
});
