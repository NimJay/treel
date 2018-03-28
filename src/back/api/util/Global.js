const mongoose = require('mongoose');

function getLoggedInUserId(req) {
    if (!req.session) return null;
    return req.session.userId;
}

function getLoggedInUser(req, callback) {
    var id = getLoggedInUserId(req);
    if (id == null) return callback(null, null);
    var User = mongoose.model('User');
    User.findById(id, callback);
}

function isValidContent(c) {
    if (c.type == 'paragraph') {
        if (!c.paragraph || c.paragraph.length == 0)
            return false;
    }
    return true;
}

module.exports = { getLoggedInUserId, getLoggedInUser, isValidContent };
