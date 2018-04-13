const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Output = require('./util/Output.js').Output;


function post(req, res) {

    var o = new Output(res);

    // POST variable.
    var { email, password } = req.body;
    if (email === undefined || password === undefined)
        return o.err('MISSING_POST').out();
    if (!email.length || !password.length)
        return o.err('INVALID_INPUT').out();
    email = email.toLowerCase();

    // Retrieve the User.
    var User = mongoose.model('User');
    User.findOne({ 'email': email }, function (err, user) {
        if (err) return o.err('DATABASE').out();
        else if (!user) return o.err('INVALID_COMBO').out();

        // Check password.
        bcrypt.compare(password, user.passwordHash, function(err, result) {
            if (err) return o.err().out();
            else if (!result) return o.err('INVALID_COMBO').out();

            if (err) return o.err().out();
            o.set('user', user);
            return checkVerification(o, user);
        });

    });
}


// Check if email has been verified.
function checkVerification(o, user) {
    let Verification = mongoose.model('Verification');
    Verification.findOne({ user: user.id, isVerified: true }, (err, v) => {
        if (err) return o.err('DATABASE').out();
        if (!v) return o.err('NOT_VERIFIED').out();
        req.session.userId = user._id; // Login!
        o.out();
    });
}


module.exports = { post };
