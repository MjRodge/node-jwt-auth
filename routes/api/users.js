const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load register validation
const validateRegisterInput = require("../../validation/register");
//load login validation
const validateLoginInput = require("../../validation/login");

//load user model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Test user routes
// @access  Public
router.get("/test", (req, res) => res.json({ message: "test for user" }));

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      //returns true if user already registered
      errors.email = "Email already registered";
      return res.status(400).json(errors);
    } else {
      //create new user if not already existing
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
      //generate salted password for security
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

// @route   POST api/users/login
// @desc    Login user / returning JWT
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email: email }).then(user => {
    //check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    //check password if user = true
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user is matched
        //create jwt payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 }, //expiration of token after 1 hour
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // return authenticated user's id/name/email
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
