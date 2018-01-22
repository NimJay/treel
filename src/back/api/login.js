const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Output = require('./util/Output.js').Output;


function post(req, res) {

    var o = new Output(res);

    // POST variable.
    var { email, password } = req.body;
    if (!email || !password)
        return o.err('MISSING_POST').out();

    // Retrieve the User.
    var User = mongoose.model('User');
    User.findOne({ 'email': email }, function (err, user) {
        if (err) return o.err('DATABASE').out();
        else if (!user) return o.err('INVALID_COMBO').out();

        // Check password.
        bcrypt.compare(password, user.passwordHash, function(err, result) {
            if (err) return o.err().out();
            else if (!result) return o.err('INVALID_COMBO').out();

            // Login!
            if (err) return o.err().out();
            req.session.userId = user._id;
            o.set('user', user).out();

        });

    });
}


module.exports = { post };
