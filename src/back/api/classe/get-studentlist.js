const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;

/**
 * Retrieve the StudentList for the specified classeId.
 */
function post(req, res) {
    postOutput(req, res, o => o.out());
}

function postOutput(req, res, cb) {

    let o = new Output(res),
        StudentList = mongoose.model('StudentList'),
        Classe = mongoose.model('Classe');

    // Must be logged in.
    getLoggedInUser(req, (err, user) => {
        if (err) return cb(o.err('DATABASE'));
        if (!user) return cb(o.err('NOT_LOGGED_IN'));

        // Gather and validate input.
        var { classeId } = req.body;
        if (classeId === undefined) return cb(o.err('MISSING_POST'));
        if (!mongoose.Types.ObjectId.isValid(classeId))
            return cb(o.err('INVALID_INPUT'));

        // Retrieve the Classe.
        Classe.findById(classeId, (err, classe) => {
            if (err) return cb(o.err('DATABASE'));
            if (!classe) return cb(o.err('INVALID_INPUT'));

            // Must be either the creator or an Instructor.
            var isCreator = user && classe.creator.equals(user._id),
                isInstructor = user &&
                    classe.instructors.some(i => i.equals(user._id));
            if (!isCreator || !isInstructor)
                return cb(o.err('INVALID_INPUT'));

            // Retrieve the StudentList.
            StudentList.findOne({ classe: classe._id }, (err, sl) => {
                if (err) return cb(o.err('DATABASE'));
                return cb(o.set('studentList', sl || null));
            });
        });
    });
}


module.exports = { post, postOutput };
