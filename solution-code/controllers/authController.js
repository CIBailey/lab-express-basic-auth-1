const authController = require("express").Router();

// User model
const User           = require("../models/users");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var userpass = req.body.password;

  if (username === "" || userpass === "") {
    res.render("auth/signup", { errorMessage: "Indicate a username and a password to sign up" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { errorMessage: "The username already exists" });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var password = bcrypt.hashSync(userpass, salt);

    var newUser  = User({
      username,
      password
    });

    newUser.save((err) => {
      res.redirect("/login");
    });
  });
});

module.exports = authController;
