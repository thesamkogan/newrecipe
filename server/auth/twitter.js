const router = require('express').Router();
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
const { User } = require('../db/models');

const twitterCredentials = {
  consumerKey: 'YOUR_KEY',
  consumerSecret: 'YOUR_SECRET',
  callbackURL: 'YOUR_CALLBACK_URL'
}

function verificationCallback (token, refreshToken, profile, done) {
  // twitter may not provide an email, if so we'll just fake it
  const email = profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@');
  const photo = profile.photos ? profile.photos[0].value : undefined;
  const info = {
    name: profile.displayName,
    email: email,
    photo: photo
  };

  User.findOrCreate({
      where: { twitterId: profile.id },
      defaults: info
    })
    .spread(user => {
      done(null, user);
    })
    .catch(done);
}

passport.use(new TwitterStrategy(twitterCredentials, verificationCallback));

router.get('/', passport.authenticate('twitter'));

router.get('/verify',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`/users/${req.user.id}`);
  }
);

module.exports = router;