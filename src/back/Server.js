const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const api = require('./api/ApiRouter.js');
const PORT = require('./Config').PORT;
const { connect } = require('./Mongo.js');

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
    var sendIndex = (req, res) => {res.sendFile(path.resolve(__dirname + '/../public/index.html'));}
    app.get('/about', sendIndex);
    app.get('/sign-up', sendIndex);

    // Everything else: index.html with 404.
    app.use((req, res) => {
        res.status(404);
        res.sendFile(__dirname + '/../public/index.html');
    });

    app.listen(PORT, function () {
        console.log('Serving Treel at: http://localhost:' + PORT);
    });
});
