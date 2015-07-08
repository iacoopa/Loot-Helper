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

router.post('/update/:id', function(req, res) {
   var db = req.db;
   var id = req.params.id;
   console.log(id);
   var collection = db.get('memberlist');
   
   var data = req.body;
   console.log(data['data[0][1][0][name]']);
   
   collection.find({'sid':id}, {}, function(e, docs) {
       console.log(docs);
       for (i = 0; i < 8; i++) {
           collection.updateById(docs[i]._id, {"name": data['data[' + i + '][' + i + 1 + '][0].name'], "loot": data['data[' + i + '][' + i + 1 + '][1].loot']});
       }
   });
});

module.exports = router;