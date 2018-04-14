const router = require('express').Router();

router.use('/local', require('./local'));
router.use('/google', require('./google'));
router.use('/github', require('./github'));
router.use('/twitter', require('./twitter'));

module.exports = router;
