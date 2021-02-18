const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Student model
const Student = require('../models/student.server.model');
const { forwardAuthenticated, adminAuthenticated } = require('../config/auth');

//Home Page

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

router.get('/login/admin', adminAuthenticated, (req, res) => res.render('adminLogin'));


// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password ) {
    errors.push({ msg: 'Please enter all fields' });
  }


  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      email,
      password
    });
  } else {
    Student.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          password
        });
      } else {
        const newUser = new Student({
          firstName,
          lastName,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  console.log(req, "user");
  passport.authenticate('local', {
    successRedirect: '/comments',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Admin login
var sess;
router.post('/login/admin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/students',
    failureRedirect: '/users/login/admin',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
