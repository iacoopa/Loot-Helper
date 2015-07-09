var express = require('express');
var monk = require('monk');
var router = express.Router();

router.get('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    res.render('session', {user: req.cookies.username});
});

router.get('/memberlist/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    var collection = db.get('memberlist');
    
    collection.find({'sid':id}, {}, function(e, docs) {
        res.json(docs);
    });
});

router.post('/update', function(req, res) {
   var db = req.db;
   var collection = db.get('memberlist');
   var data = req.body;
   for (i = 0; i < 8; i++) {
       collection.update({_id: data['data['+i+'][_id]']}, {$set: {name: data['data['+i+'][name]'], loot: data['data['+i+'][loot]']}}, function(e, r){});
   }
   res.send('a-ok');
});

module.exports = router;