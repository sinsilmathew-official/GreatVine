var express = require('express');
var router = express.Router();

router.get('/api/accounts', function(req, res) {
    // if auth has not been set, redirect to index
        if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }
    //SOQL query
        let q = 'SELECT id, name FROM account LIMIT 10';
    //instantiate connection
        let conn = new jsforce.Connection({
            oauth2 : {oauth2},
            accessToken: req.session.accessToken,
            instanceUrl: req.session.instanceUrl
       });
    //set records array
        let records = [];
        let query = conn.query(q)
           .on("record", function(record) {
             records.push(record);
           })
           .on("end", function() {
             console.log("total in database : " + query.totalSize);
             console.log("total fetched : " + query.totalFetched);
             res.json(records);
           })
           .on("error", function(err) {
             console.error(err);
           })
           .run({ autoFetch : true, maxFetch : 4000 });
    });

    module.exports = router;    