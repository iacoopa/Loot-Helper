var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.username) {
    res.render('register', {title: 'Register', username: req.cookies.username});
  } else {
    res.render('register', { title: 'Register' });
  }
});

module.exports = router;


router.post('/createuser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var no = false
    collection.count({username : req.body.username}, function(err, count) {
        console.log(count);
        if (count != 0) {
            res.send(
            {msg: "Username already in use."}
            );
            no = true;
        }
    });
    
    setTimeout(function() {
        if (!no) {
            collection.insert(req.body, function(err, result) {        
                    console.log(req.body.charname);
                    res.cookie('username', req.body.username, {maxAge:90000000000});
                    res.cookie('charname', req.body.charname);
                    res.send(
                        (err === null) ? {msg: ''} : {msg: err}
                    );
                
            });
        }
    }, 3000);
});