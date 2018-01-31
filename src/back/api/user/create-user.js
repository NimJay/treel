const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Output } = require('../util/Output.js');

/**
 * Create a user.
 */
function post(req, res) {

    var o = new Output(res);

    // Input
    var { email, password, name, type } = req.body;
    if ([email, password, name, type].some(a => a === undefined))
        return o.err('MISSING_POST').out();

    // Validate input.
    if (!email || email.lenth > 100 || (email.match(/@/g) || []).length != 1)
        return o.err('INVALID_INPUT', 'Invalid email.').out();
    if (password.length < 6 || password.length > 50)
        return o.err('INVALID_INPUT', 'Invalid password.').out();
    if (name.length < 2 || name.length > 50)
        return o.err('INVALID_INPUT', 'Invalid name.').out();
    if (![1, 2].includes(type)) // Can only create students/intructors.
        return o.err('INVALID_INPUT', 'Invalid type.').out();
    email = email.toLowerCase();

    // Email in use?
    var User = mongoose.model('User');
    User.findOne({ 'email': email }, function (err, result) {
        if (err) return o.err('DATABASE').out();
        else if (result) return o.err('EMAIL_TAKEN').out();
        else {

            // Hash password.
            const SALT_ROUNDS = 10;
            const PASSWORD = 'TreelBcryptPassword';
            bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
                bcrypt.hash(password, salt, function(err, passwordHash) {

                    // Create user, login, and output.
                    newUser = new User({ email, passwordHash, name, type });
                    newUser.save(function (err, newUser) {
                        if (err) return o.err('DATABASE').out();
                        req.session.userId = newUser._id; // Login.
                        return o.set('user', newUser).out();
                    });

                });
            });
        }
    });
}

module.exports = { post };
