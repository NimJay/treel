const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // Input is always JSON.
router.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json'); // Output is always JSON.
    next();
})

router
    .post('/class/create-class', require('./classe/create-classe.js').post)
    .post('/class/get-dashboard', require('./classe/get-dashboard.js').post)
    .post('/get-logged-in-user', require('./get-logged-in-user.js').post)
    .post('/login', require('./login.js').post)
    .post('/logout', require('./logout.js').post)
    .post('/school/get-schools', require('./school/get-schools.js').post)
    .post('/user/create-user', require('./user/create-user.js').post)
    .post('/user/update-user', require('./user/update-user.js').post);

module.exports = router;
