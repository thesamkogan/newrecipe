const router = require('express').Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const { User } = require('../db/models');

const githubCredentials = {
  clientID: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  callbackURL: 'YOUR_CALLBACK_URL'
};

function verificationCallback (token, refreshToken, profile, done) {
  // github may not provide an email, if so we'll just fake it
  const email = profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@');
  const photo = profile.photos ? profile.photos[0].value : undefined;
  
  const info = {
    name: profile.displayName,
    email: email,
    photo: photo
  };

  User.findOrCreate({
      where: { githubId: profile.id },
      defaults: info
    })
    .spread(user => {
      done(null, user);
    })
    .catch(done);
  
}

passport.use(new GitHubStrategy(githubCredentials, verificationCallback))

router.get('/', passport.authenticate('github'));

router.get('/verify',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`/users/${req.user.id}`);
  }
);

module.exports = router;
