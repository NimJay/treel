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

/**
 * Return true iff the given Content is valid.
 */
function isValidContent(c) {

    if (!['paragraph', 'link', 'file'].includes(c.type))
        return false;

    if (c.type == 'paragraph') {
        if (!c.paragraph)
            return false;

    } else if (c.type == 'link') {
        if (!c.link || !c.name)
            return false;

    } else if (c.type == 'file') {
        if (!c.file || !c.name)
            return false;
    }

    return true;
}

module.exports = { getLoggedInUserId, getLoggedInUser, isValidContent };
