const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const api = require('./api/ApiRouter.js');
const PORT = require('./Config').PORT;
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

    // Send index.html for all pages.
    app.get('/', sendHtml.bind(null, '/'));
    app.get('/about', sendHtml.bind(null, '/about'));
    app.get('/sign-up', sendHtml.bind(null, '/sign-up'));

    // Everything else: 404.
    app.use(sendHtml.bind(null, null));

    app.listen(PORT, function () {
        console.log('Serving Treel at: http://localhost:' + PORT);
    });
});

// Function used by /pages that spit out HTML.
function sendHtml(page, req, res) {
    new HtmlCreator(req, res, page, htmlCreator => {
        res.send(htmlCreator.create());
    });
}
