const mongoose = require('mongoose');
const Output = require('./util/Output.js').Output;

/**
 * Retrieves the User currently logged in.
 * Example output: { user: {...} }
 * If not logged in, The user will be null.
 */
function post(req, res) {
    postOutput(req, res, o => o.out());
}

function postOutput(req, res, callback) {
    let o = new Output(res),
        userId = req.session.userId;
    if (!userId) return callback(o.set('user', null));
    var User = mongoose.model('User');
    User.findById(userId, function (err, user) {
        if (err) return callback(o.err('DATABASE'));
        return callback(o.set('user', user));
    });
}

module.exports = { post, postOutput };
