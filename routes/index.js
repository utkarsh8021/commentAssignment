const express = require('express');
const Student = require('../models/student.server.model');
var ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, adminAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

//About Page
// router.get('/about', forwardAuthenticated, (req,res) => res.render('about'));

//About Page
router.get('/comments', forwardAuthenticated, (req,res) => res.render('comment_student'));

//About Page
router.get('/students', adminAuthenticated, (req,res) => res.render('students'));

//About Page
router.get('/project', forwardAuthenticated, (req,res) => res.render('project'));
//About Page
// router.get('/contact', forwardAuthenticated, (req,res) => res.render('contact'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, function (req, res) {
  Student.find({}, function(err, produtos) {
      if (err){
          console.log(err);
      }else{
          res.render('business_contacts.ejs', { data: produtos});
          }
      });
});

router.post('/bussiness_contacts/edit/:id', function(req, res){
  let data = req.body;
  let id = new ObjectID(req.params.id);
  data._id = id;
  Student.findByIdAndUpdate(id, data).then(function(err) {
    console.log(err, 'kkkkk');
    Student.findOne().then(function(items) {
      console.log(items)
      customers = items;
      res.redirect('/coments');
    });
  });
});




module.exports = router;
