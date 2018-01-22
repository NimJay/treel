const mongoose = require('mongoose');
const Output = require('./util/Output.js').Output;

/**
 * Retrieves the User currently logged in.
 * Example output: { user: {...} }
 * If not logged in, The user will be null.
 */
function post(req, res) {
    var o = new Output(res),
        userId = req.session.userId;
    if (!userId) return o.set('user', null).out();
    var User = mongoose.model('User');
    User.findById(userId, function (err, user) {
        if (err) return o.err('DATABASE').out();
        return o.set('user', user).out();
    });
}

module.exports = { post };
