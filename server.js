var connect = require('connect'),
    combo   = require('combohandler'),
    express = require('express'),

    app    = express.createServer(),
    port   = process.env.PORT || 3000,
    pubDir = __dirname + '/public';

app.configure(function () {
    app.use(express.favicon());
    app.use(express.staticCache());
    app.use(express.static(pubDir));
});

// Combo-handler for JavaScript.
app.get('/js', combo.combine({rootPath: pubDir + '/js'}), function (req, res) {
    if (connect.utils.conditionalGET(req)) {
        if (!connect.utils.modified(req, res)) {
            return connect.utils.notModified(res);
        }
    }

    res.send(res.body, 200);
});

// The actual PNM app.
app.get('/', function (req, res) {
    res.sendfile('index.html');
});

// Restrict to only known paths that the app can respond to:
//
//  - "/place/:id/"
//  - "/photo/:id/"
//
// Redirects back to "/" with the URL as a fragment, e.g. "/#/photo/:id/"
app.get(/^\/(?:(?:place|photo)\/\d+\/)$/, function (req, res) {
    res.redirect('/#' + req.url, 302);
});

app.listen(port, function () {
    console.log('Server listening on ' + port);
});
