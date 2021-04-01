const express = require("express");
const passport = require("../middleware/passport");
const passwordGithub = require("../middleware/passport-github");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminder/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router.get("/github", passwordGithub.authenticate("github"));

router.get(
  "/github/callback",
  passwordGithub.authenticate("github", { failureRedirect: "/auth/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/reminder/dashboard");
  }
);

module.exports = router;
