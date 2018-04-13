const mongoose = require('mongoose'),
    { Output } = require('../util/Output.js'),
    { getLoggedInUser } = require('../util/Global.js');


function post(req, res) {

    let o = new Output(res),
        Verification = mongoose.model('Verification');

    // Input.
    let { code } = req.body;
    if (!code) return o.err('MISSING_POST').out();
    if (code.length < 2 || 200 < code.length)
        return o.err('INVALID_INPUT').out();

    // Retrieve Verification.
    Verification.findOne({ code }, (err, v) => {
        if (err) return o.err('DATABASE').out();
        if (!v) return o.err('INVALID_INPUT').out();

        // Already verified.
        if (v.isVerified)
            return getUser(req, o, v.user);

        /* TODO: Implement resending (so Verifications can be expired).
        // Out-dated?
        let now = new Date(),
            lifeSpan = 10 * 24 * 60 * 60 * 1000; // 10 days.
        if (timeCreated + lifeSpan < now)
            return o.err('INVALID_INPUT').out();
        */

        v.isVerified = true;
        v.save((err, savedV) => {
            if (err || !savedV) return o.err('DATABASE').out();
            return getUser(req, o, savedV.user);
        });
    });
}


// Retrieve the User and login.
function getUser(req, o, userId) {
    let User = mongoose.model('User');
    User.findById(userId, (err, user) => {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('INVALID_INPUT').out();
        o.set('user', user);
        req.session.userId = user._id; // Login!
        o.out();
    });
}


module.exports = { post };
