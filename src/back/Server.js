const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const api = require('./api/ApiRouter.js');
const download = require('./Downloader.js').download;
const CONFIG = require('./Config');
const { connect } = require('./Mongo.js');
const HtmlCreator = require('./HtmlCreator.js').HtmlCreator;


// Connect to Mongo, set up sessions, and run server.
connect(function (db) {

    // Setup session.
    app.use(session({
        secret: 'TreelSessionSecret',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ 'mongooseConnection': db })
    }));

    app.use(express.static(__dirname + '/../public')); // Serve this directory.
    app.use('/api', api); // Treel API.
    app.get('/file/:fileId', download); // Download Users' uploads.

    // Send index.html for all pages.
    app.get('/', sendHtml.bind(null, '/'));
    app.get('/about', sendHtml.bind(null, '/about'));
    app.get('/sign-up', sendHtml.bind(null, '/sign-up'));
    app.get('/class/new', sendHtml.bind(null, '/class/new'));
    app.get('/class/:classeId', sendHtml.bind(null, '/class/:classeId'));

    // Everything else: 404.
    app.use(sendHtml.bind(null, null));

    // Create directory for uploaded files.
    if (!fs.existsSync(CONFIG.FILES_DIR))
        fs.mkdirSync(CONFIG.FILES_DIR);

    app.listen(CONFIG.PORT, function () {
        console.log('Serving Treel at: http://localhost:' + CONFIG.PORT);
    });
});

// Function used by /pages that spit out HTML.
function sendHtml(page, req, res) {
    new HtmlCreator(req, res, page, htmlCreator => {
        res.send(htmlCreator.create());
    });
}
