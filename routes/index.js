var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.charname) {
      res.render('sessions', { char: req.cookies.charname, user: req.cookies.username});
  } else {
      res.render('sessions');
  }
});

module.exports = router;
