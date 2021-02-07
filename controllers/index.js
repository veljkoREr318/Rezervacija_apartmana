var express = require('express');
var router = express.Router();

router.use('/',require('./home'));
router.use('/hotel',require('./hotel'));

module.exports = router;
