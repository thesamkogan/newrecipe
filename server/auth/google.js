const router = require('express').Router();
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const { User } = require('../db/models');

const googleCredentials = {
  clientID: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  callbackURL: 'YOUR_CALLBACK_URL'
};

// The following callback will be used when passport successfully authenticates with Google (the provider) for us, using our `clientId`, `clientSecret` and the temporary token from the client
  // Google will send back the `token`, `refreshToken` and `profile` - passport provides the `done` function
function verificationCallback (token, refreshToken, profile, done) {
  // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
  const info = {
    name: profile.displayName,
    email: profile.emails[0].value,
    photo: profile.photos ? profile.photos[0].value : undefined
  };

  User.findOrCreate({
      where: { googleId: profile.id }, // find this user
      defaults: info // if we don't find them, then create with this information
    })
    .spread((user, createdBool) => {
      done(null, user);
    })
    .catch(done);
}

passport.use(new GoogleStrategy(googleCredentials, verificationCallback));

// 1. Client request to login through Google -- `http://localhost:1337/auth/google`
router.get('/', passport.authenticate('google', { scope: 'email' }));

// 2. Client hits this once they have verified with the provider (the callback URL)
   // `http://localhost:1337/auth/google/verify`
router.get('/verify',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => { // a successRedirect is fine, but with this we can use `req` for a more meaningful redirect
    res.redirect(`/users/${req.user.id}`);
  }
);

module.exports = router;
