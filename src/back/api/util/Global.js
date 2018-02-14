const mongoose = require('mongoose');

function getLoggedInUserId(req) {
    return req.session.userId;
}

function getLoggedInUser(req, callback) {
    var id = getLoggedInUserId(req);
    if (id == null) return callback(null, null);
    var User = mongoose.model('User');
    User.findById(id, callback);
}

module.exports = { getLoggedInUserId, getLoggedInUser };
