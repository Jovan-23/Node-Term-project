module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.user) {
      return next();
    }
    res.redirect("/auth/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.user) {
      return next();
    }
    res.redirect("/reminder/dashboard");
  },
};
