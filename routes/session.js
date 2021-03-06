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

router.get('/usersessionlist', function(req, res) {
    console.log("test");
   var db = req.db;
   var owner = req.cookies.username;
   console.log(owner);
   var collection = db.get('sessionlist');
   collection.find({owner:owner}, {}, function(e, docs) {
      res.json(docs); 
   });
});

router.get('/sessionlist', function(req, res) {
    var db = req.db;
    var server = req.params.server;
    var collection = db.get('sessionlist');
    collection.find({}, {}, function(e, docs){
        res.json(docs);
    });   
});


router.post('/createsession', function(req, res) {
    var db = req.db;
    var collection = db.get('sessionlist');
    var newSession = {
        'sid': req.body.sid,
        'server': req.body.server,
        'instance': req.body.instance,
        'leader': req.cookies.charname,
        'owner': req.cookies.username
    }
    
    collection.insert(newSession, function(err, result) {
        console.log(result);
        col = db.get('memberlist');
        for (i = 0; i < 8; i++) {
            var newMember = {
                'sid': req.body.sid,
                'name': '',
                'loot': ''
            }
            console.log(newMember);
            col.insert(newMember);
        }
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
        );
    });
});

router.delete('/deletesession/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('sessionlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.get('/userlist/:sid', function(req, res) {
   var db = req.db;
   var sid = req.params.sid;
   
   var collection = db.get('memberlist');
   
    collection.find({sid:sid}, {}, function(e, docs){
        res.json(docs);
    });  
});

module.exports = router;
