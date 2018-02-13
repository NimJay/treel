const mongoose = require('mongoose');
const { Output } = require('../util/Output.js');

/**
 * Update a user.
 * Note: This call does not support the updating of emails and passwords.
 */
function post(req, res) {

    var o = new Output(res);
    if (req.session.userId == null)
        return o.err('NOT_LOGGED_IN').out();

    // Input
    var { _id, name } = req.body;
    if ([_id, name].some(a => a === undefined))
        return o.err('MISSING_POST').out();

    // Validate input.
    if (_id != req.session.userId)
        return o.err('INVALID_INPUT', 'Can only edit yourself.').out();
    if (name.length < 2 || name.length > 50)
        return o.err('INVALID_INPUT', 'Invalid name.').out();

    let User = mongoose.model('User');
    User.findById(_id, function (err, user) {
        if (err) return o.err('DATABASE').out();
        else if (!user) return o.err('INVALID_INPUT').out();
        else {
            // Update user.
            user.name = name;
            user.save(function (err, updatedUser) {
                if (err) return o.err('DATABASE').out();
                return o.set('user', updatedUser).out();
            });
        }
    });
}

module.exports = { post };
