var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.charname) {
      res.render('sessions', { user: req.cookies.charname});
  } else {
      res.render('sessions');
  }
});

module.exports = router;
