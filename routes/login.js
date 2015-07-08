var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/processlogin', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    
    collection.find({username : req.body.username}, function(err, data) {
       console.log(data[0]);
       console.log(req.body);

       if (data[0].password == req.body.password) {
            res.clearCookie('username');
            res.cookie('username', req.body.username, {maxAge:90000000000});
            if (!req.cookies.charname)
                res.cookie('charname', data[0].charname);

           res.send(
           {msg: ''}
           );
       } else {
           res.send(
           {msg: 'Incorrect password'}
           );
       }
    });
});

module.exports = router;
