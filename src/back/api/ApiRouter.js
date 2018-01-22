const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // Input is always JSON.
router.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json'); // Output is always JSON.
    next();
})

router.post('/login', require('./login.js').post)
    .post('/logout', require('./logout.js').post)
    .post('/user/create-user', require('./user/create-user.js').post)
    .post('/get-logged-in-user', require('./get-logged-in-user.js').post);

module.exports = router;
