// routes/auth.js
const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
const Place = require("../models/place");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// adding passport for auth routes
const passport = require("passport");

//________________________________________________________SIGN UP___________________________________________________________//
//GET
router.get("/signup", (req, res, next) => { 
  res.render("auth/signup");
});

//POST
router.post("/signup", (req, res, next) => {
  const {
    username,
    password,
  } = req.body;

  //CHECKING CONTENT
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  //CHEKING PASSWORD LENGTH
  if (password.length < 6) {
    res.render("auth/signup", {
      errorMessage: "Password shoul be at least 6 characters"
    });
    return;
  }

  //CHEKING USERNAME
  User
  .findOne({username})
  .then(user => {
    if (user) {
      res.render("auth/signup", {
          errorMessage: "The username already exists!"
    });
        return;
  }

  //BCRYPTING PASSWORD
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //CREATING USER
  User
  .create({ username, password: hashPass })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
})
  .catch(error => {next(error);
  })
});


module.exports = router;