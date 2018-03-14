const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // Input is always JSON.
router.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json'); // Output is always JSON.
    next();
})

router
    .post('/classe/create-classe', require('./classe/create-classe.js').post)
    .post('/classe/get-classe', require('./classe/get-classe.js').post)
    .post('/classe/get-dashboard', require('./classe/get-dashboard.js').post)
    .post('/classe/search-classes', require('./classe/search-classes.js').post)
    .post('/classe/update-classe', require('./classe/update-classe.js').post)
    .post('/follow/create-follow', require('./follow/create-follow.js').post)
    .post('/follow/remove-follow', require('./follow/remove-follow.js').post)
    .post('/get-logged-in-user', require('./get-logged-in-user.js').post)
    .post('/login', require('./login.js').post)
    .post('/logout', require('./logout.js').post)
    .post('/school/get-schools', require('./school/get-schools.js').post)
    .post('/section/create-section', require('./section/create-section.js').post)
    .post('/section/move-section', require('./section/move-section.js').post)
    .post('/section/update-section', require('./section/update-section.js').post)
    .post('/user/create-user', require('./user/create-user.js').post)
    .post('/user/update-user', require('./user/update-user.js').post);

module.exports = router;
