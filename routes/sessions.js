var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/sessionlist/:server', function(req, res) {
    
    var db = req.db;
    var server = req.params.server;
    if (server == "Server") {
        var collection = db.get('sessionlist');
        collection.find({}, {}, function(e, docs){
            res.json(docs);
        });   
    } else {
         var collection = db.get('sessionlist');
        collection.find({server:server}, {}, function(e, docs){
            res.json(docs);
        });   
    }
});

router.get('/', function(req, res) {
   res.render('index'); 
});