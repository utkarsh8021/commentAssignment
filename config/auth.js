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
    req.flash('success_msg', 'Please log in as Admin to view this page');
    res.redirect('/users/login/admin');
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/comments');      
  },
  session: function(req, res){
    return req.session;
},
  adminAuthenticated: function (req, res, next) {
    
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/students');
  }

};
