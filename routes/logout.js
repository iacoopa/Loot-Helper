var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.clearCookie('charname');
    res.redirect("../");
});

module.exports = router;
