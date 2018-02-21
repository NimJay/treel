const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;

function post(req, res) {

    var School = mongoose.model('School');

    getLoggedInUser(req, function (err, user) {

        var o = new Output(res);

        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();
        if (user.type != 1) return o.err().out();

        // Gather input.
        var { courseCode, courseName, term, school } = req.body;
        if ([courseCode, courseName, term, school].some(a => a === undefined))
            return o.err('MISSING_POST').out();

        // Validate input.
        if (!courseCode || courseCode.lenth > 50)
            return o.err('INVALID_INPUT', 'Invalid courseCode.').out();
        if (!courseName || courseName.lenth > 50)
            return o.err('INVALID_INPUT', 'Invalid courseName.').out();
        if (!term || term.length > 50)
            return o.err('INVALID_INPUT', 'Invalid term.').out();

        // If School ID provided, we need not create a new School.
        if (school._id) {
            School.findById(school._id, function (err, school) {
                if (err) return o.err('DATABASE').out();
                if (!school) return o.err('INVALID_INPUT').out();
                return createClasse(
                    o, courseCode, courseName, term, school._id, user._id);
            });

        } else {

            // Validate School input.
            if (!school.name || school.name.length > 50 ||
                !school.country || school.country.length > 50)
                return o.err('INVALID_INPUT', 'Invalid school.').out();

            // Create new School.
            s = new School({
                name: school.name, country: school.country, creator: user._id
            });
            s.save(function (err, school) {
                if (err) return o.err('DATABASE').out();
                return createClasse(
                    o, courseCode, courseName, term, school._id, user._id);
            });
        }
    });
}


function createClasse(o, courseCode, courseName, term, school, creator) {
    var Classe = mongoose.model('Classe');
    var instructors = [creator];
    newClasse = new Classe(
        { courseCode, courseName, term, school, creator, instructors });
    newClasse.save(function (err, classe) {
        if (err) return o.err('DATABASE').out();
        return createSection(o, classe);
    });
}


function createSection(o, classe) {
    var Sections = mongoose.model('Sections');
    newSections = new Sections({ classe: classe._id, sections: [] });
    newSections.save(function (err, sections) {
        if (err) return o.err('DATABASE').out();
        return o.set('classe', classe).set('sections', sections).out();
    });
}


module.exports = { post };
