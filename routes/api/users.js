const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

//load user model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Test user routes
// @access Public
router.get("/test", (req, res) => res.json({ message: "test for user" }));

// @route POST api/users/register
// @desc Register a user
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already registered" });
    } else {
      //use gravatar for avatar data
      const avatar = gravatar.url(req.body.email, {
        s: "200", //avatar size
        r: "pg", //avatar rating
        d: "mm" //default avatar
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user / returning JWT
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email: email }).then(user => {
    //check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    //check password if user = true
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ message: "success" });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
