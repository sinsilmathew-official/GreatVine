var express = require('express');
var router = express.Router();

var jsforce = require('jsforce');

//jsForce connection
const oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    //loginUrl : 'https://your-unique-dev-url.my.salesforce.com',
    //clientId and Secret will be provided when you create a new connected app in your SF developer account
    clientId :process.env.CLIENT_ID,
    clientSecret :process.env.CLIENT_SECRET,
    // clientId : 'client id', 
    // clientSecret : 'client secret',
    //redirectUri : 'http://localhost:' + port +'/token'
    redirectUri : 'http://localhost:3000'
});

router.get("/login", function(req, res) {
    // Redirect to Salesforce login/authorization page
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web refresh_token'}));
});

router.get('/token_callback', function(req, res) {
    const conn = new jsforce.Connection({oauth2: oauth2});
        const code = req.query.code;
        conn.authorize(code, function(err, userInfo) {
            if (err) { return console.error("This error is in the auth callback: " + err); }
            console.log('Access Token: ' + conn.accessToken);
            console.log('Instance URL: ' + conn.instanceUrl);
            console.log('refreshToken: ' + conn.refreshToken);
            console.log('User ID: ' + userInfo.id);
            console.log('Org ID: ' + userInfo.organizationId);
            req.session.accessToken = conn.accessToken;
            req.session.instanceUrl = conn.instanceUrl;
            req.session.refreshToken = conn.refreshToken;
            var string = encodeURIComponent('true');
            res.redirect('http://localhost:3000/?valid=' + string);
    });
});   

module.exports = router;