const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const GITHUB_CLIENT_ID = "287c35960c01178e3c85";
const userController = require("../controllers/userController");

const GITHUB_CLIENT_SECRET = "99a22cb29eefa94c8da2830f85995fb9818711a0";
const githubLogin = new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback",
  },
  (accessToken, refreshToken, userParam, done) => {
    let user = userController.getUserByGitHubIDorCreate(userParam);
    console.log(user);
    return done(null, user);
  }
);

// Create a session for the user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// req.user going to have all info about logged in user

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(githubLogin);
