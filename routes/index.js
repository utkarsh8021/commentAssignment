const express = require('express');
const Student = require('../models/student.server.model');
const Comment = require('../models/comments.server.model');
var ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, adminAuthenticated, ensureAdminAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));


//About Page
router.get('/thankyou', ensureAuthenticated, (req, res) => {
  user = req.user
  res.render('thank');
});

//About Page
router.get('/project', forwardAuthenticated, (req,res) => res.render('project'));
//About Page
// router.get('/contact', forwardAuthenticated, (req,res) => res.render('contact'));
let use = {}
// Dashboard
router.get('/comments', ensureAuthenticated, function (req, res) {
  // console.log(req.user, "req");
  user = req.user;
  last = user.lastName;
  Student.find({}, function(err, produtos) {
      if (err){
          console.log(err);
      } else {
        
          res.render('comments.ejs', { data: produtos});
          }
      });
});

router.get('/student', ensureAdminAuthenticated, function (req, res) {
  Student.find({}, function(err, produtos) {
      if (err){
          console.log(err);
      } else {
        if (req.user.email == 'admin@gmail.com')
          res.render('students.ejs', { data: produtos });
        else
          res.render('adminLogin.ejs');
          }
      });
});

router.get("/studentcomments/:id",ensureAdminAuthenticated, function(req,res){
  Student.findById(req.params.id, function (err, produtos) {
    console.log(produtos.email, "po");
    email = produtos.email;
    if (err) {
      res.redirect("/student");
    }
    //  else {
    //   res.render("comment_student", { data: produtos });
    // }
  }).then(function () {
    //find the posts from this author
    Comment.
      find({
        student: req.id
      }, (err, comments) => {
          console.log(comments, "comm");
        if (err) { return getErrorMessage(err); }
        //res.json(comments);
        res.render('comment_student', {
          comments: comments, email: email
        })
      })
  })
});

// Register
router.post('/comments', (req, res) => {
  const { courseCode, courseName, program, semester, comment } = req.body;
  let errors = [];

  if (!courseCode || !courseName || !program || !semester || !comment ) {
    errors.push({ msg: 'Please enter all fields' });
  }


  if (errors.length > 0) {
    res.render('comments', {
      errors,
      courseCode,
      courseName,
      program,
      semester,
      comment
    });
  } else {
    // Student.findOne({ email: email }).then(user => {
      // if (user) {
      //   errors.push({ msg: 'Email already exists' });
      //   res.render('register', {
      //     errors,
      //     firstName,
      //     lastName,
      //     email,
      //     password
      //   });
      // } else {
        const newComment = new Comment({
          courseCode,
          courseName,
          program,
          semester,
          comment
        });

       
            newComment
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/thankyou');
              })
              .catch(err => console.log(err));
          
      // }
    // });
  }
});



module.exports = router;
