const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;

/**
 * Retrieve the Classe with the specified _id, along with its Sections.
 */
function post(req, res) {
    postOutput(req, res, o => o.out());
}

function postOutput(req, res, cb) {

    getLoggedInUser(req, function (err, user) {

        var o = new Output(res);
        var { classeId } = req.body;
        if (classeId === undefined)
            return cb(o.err('MISSING_POST'));

        if (!mongoose.Types.ObjectId.isValid(classeId))
            return cb(o.err('INVALID_INPUT'));

        var Classe = mongoose.model('Classe');
        Classe
            .findById(classeId)
            .populate('instructors')
            .populate('school')
            .exec(function (err, classe) {
                if (err) return cb(o.err('DATABASE'));
                if (!classe) return cb(o.err('INVALID_INPUT'));

                // Check Access.
                if (classe.isPrivate && !user)
                    return cb(o.err('INVALID_INPUT'));
                var isCreator = user && classe.creator.equals(user._id);
                var isInstructor = user &&
                    classe.instructors.some(i => i.equals(user._id));
                if (isCreator || isInstructor || !classe.isPrivate)
                    return findSections(o, cb, classe, user);
                var Access = mongoose.model('Access');
                Access.findOne({ email: user.email, classe: classe._id },
                    (err, access) => {
                        if (err) return cb(o.err('DATABASE'));
                        if (!access) return cb(o.err('INVALID_INPUT'));
                        return findSections(o, cb, classe, user);
                    }
                );
            }
        );
    });
}


function findSections(o, cb, classe, user) {
    o.set('classe', classe);
    var Sections = mongoose.model('Sections');
    Sections.findOne({ 'classe': classe.id },
        function (err, sections) {
            if (err) return cb(o.err('DATABASE'));
            if (!sections) return cb(o.err());
            // Remove deleted sections.
            sections.sections = sections.sections.filter(s => !s.isDeleted);
            o.set('sections', sections);
            return findAnnouncements(o, cb, classe, user);
        }
    );
}


function findAnnouncements(o, cb, classe, user) {
    let Announcement = mongoose.model('Announcement');
    Announcement.find({ 'classe': classe._id }, (err, as) => {
        if (err || !as) return cb(o.err('DATABASE'));
        o.set('announcements', as);
        return findFollow(o, cb, classe, user);
    });
}


function findFollow(o, cb, classe, user) {
    if (!user) return cb(o);
    var Follow = mongoose.model('Follow');
    Follow.findOne({ 'classe': classe._id, 'user': user._id }, (err, f) => {
        if (err) return cb(o.err('DATABASE'));
        return cb(o.set('follow', f));
    });
}


module.exports = { post, postOutput };
