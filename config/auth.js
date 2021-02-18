module.exports = {
  
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },

  ensureAdminAuthenticated: function (req, res, next) {
    console.log(req.body,"bodyy");
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in as Admin to view that resource');
    res.redirect('/users/login');
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/comments');      
  },

  adminAuthenticated: function (req, res, next) {
    console.log(req.body.email,"pppp");
    if (!req.body.email == "admin@gmail.com" && !req.body.password == "admin123") {
      return next();
    }
    res.redirect('/students');
  }

};
