const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;


function post(req, res) {

    getLoggedInUser(req, function (err, user) {

        var o = new Output(res);
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();


        // Gather input.
        var { classeId, courseCode, courseName, term, isActive, isPrivate } =
            req.body;
        var required =
            [classeId, courseCode, courseName, term, isActive, isPrivate];
        if (required.some(a => a === undefined))
            return o.err('MISSING_POST').out();


        // Validate input.
        if (!courseCode || courseCode.lenth > 50)
            return o.err('INVALID_INPUT', 'Invalid courseCode.').out();
        if (!courseName || courseName.lenth > 50)
            return o.err('INVALID_INPUT', 'Invalid courseName.').out();
        if (!term || term.length > 50)
            return o.err('INVALID_INPUT', 'Invalid term.').out();
        if (typeof(isActive) !== 'boolean')
            return o.err('INVALID_INPUT', 'Invalid isActive.').out();
        if (typeof(isPrivate) !== 'boolean')
            return o.err('INVALID_INPUT', 'Invalid isPrivate.').out();
        if (!mongoose.Types.ObjectId.isValid(classeId))
            return o.err('INVALID_INPUT', 'Invalid classeId').out();


        // Retrieve and update Classe.
        var Classe = mongoose.model('Classe');
        Classe.findById(classeId, function (err, classe) {

            if (err) return o.err('DATABASE').out();
            if (!classe) return o.err('INVALID_INPUT').out();

            // Must be creator or instructor.
            if (!classe.creator.equals(user._id) &&
                classe.instructors.every(i => !i.equals(user._id)))
                return o.err().out();

            // Update and save.
            classe.courseCode = courseCode;
            classe.courseName = courseName;
            classe.term = term;
            classe.isActive = isActive;
            classe.isPrivate = isPrivate;
            classe.save(function (err, updatedClasse) {
                if (err) return o.err('DATABASE').out();
                return o.set('classe', updatedClasse).out();
            });
        });
    });
}


module.exports = { post };
