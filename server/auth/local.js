const router = require('express').Router();
const HttpError = require('../utils/HttpError');
const { User } = require('../db/models');

// This marries the original auth code we wrote to Passport.
// An alternative would be to use the "local strategy" option with Passport.

// login, i.e. "you remember `me`, right?"
// `/login` is optional because the verb and `auth/local` connotate login
router.put('/login', (req, res, next) => {
  const { email, password } = req.body

  User.findOne({
    where: { email, password }
  })
  .then(user => {
    if (!user) throw HttpError(404);
    req.login(user, err => {
      if (err) { return next(err); }
      res.send(user); // 200 is the default status!
    });
    // req.session.userId = user.id; // from when we just had sessions and no passport
  })
  .catch(next);
});

// signup, i.e. "let `me` introduce myself"
// `/signup` is optional
router.post('/signup', (req, res, next) => {
  const { email, password } = req.body

  User.create({
    email,
    password
  })
  .then(user => {
    req.login(user, err => {
      if (err) { return next(err); }
      res.status(201).send(user); // 201 created makes a lot of sense as a status here!
    })
  })
  .catch(next);
});

// logout, i.e. "please just forget `me`"
// `/logout` is optional
router.delete('/logout', (req, res, next) => {
  req.logout();
  /* Below is from when we just had sessions and no passport */
  // req.session.destroy(); // destroys entire session
  /* Below are alternatives to the above  
  delete req.session.userId; // deletes one item on session
  req.session.userId = null;
  */
  res.sendStatus(204);
});


// check currently-authenticated user, i.e. "who am I?"
// `/me` is optional
router.get('/me', (req, res, next) => {
  res.send(req.user);
})

module.exports = router;