var express = require('express');
var monk = require('monk');
var router = express.Router();

router.get('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    res.render('session');
});

router.get('/memberlist/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    var collection = db.get('memberlist');
    
    collection.find({'sid':id}, {}, function(e, docs) {
        res.json(docs);
    });
});


module.exports = router;