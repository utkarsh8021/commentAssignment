module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/comments');      
  },
  adminAuthenticated: function (req, res, next) {
    if(req.body.email == 'admin' && req.body.password=='admin@123')
    // if (!req.isAuthenticated())
    {
      return next();
    }
    res.redirect('/studentcomments');      
  }
};


