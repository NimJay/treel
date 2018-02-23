const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;

function post(req, res) {

    getLoggedInUser(req, function (err, user) {

        var o = new Output(res);
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Gather input.
        var { classeId, sectionId, name, isDeleted } = req.body;
        if ([classeId, sectionId, name, isDeleted].some(a => a === undefined))
            return o.err('MISSING_POST').out();

        // Validate input.
        if (typeof(name) !== 'string' || name.lenth > 50)
            return o.err('INVALID_INPUT', 'Invalid name.').out();
        if (typeof(isDeleted) !== 'boolean')
            return o.err('INVALID_INPUT', 'Invalid isDeleted.').out();
        if (!mongoose.Types.ObjectId.isValid(classeId))
            return cb(o.err('INVALID_INPUT', 'Invalid classeId.'));
        if (!mongoose.Types.ObjectId.isValid(sectionId))
            return cb(o.err('INVALID_INPUT', 'Invalid sectionId.'));

        var Sections = mongoose.model('Sections');
        Sections.findOne({ classe: classeId }, function (err, ss) {
            if (err) return o.err('DATABASE').out();
            if (!ss) return o.err('INVALID_INPUT', 'Invalid classeId.').out();

            // Locate the Section.
            var i = ss.sections.findIndex(s => s._id.equals(sectionId));
            if (i == -1)
                return o.err('INVALID_INPUT', 'Invalid sectionId.').out();

            // Update and save.
            ss.sections[i].name = name;
            ss.sections[i].isDeleted = isDeleted;
            ss.save(function (err, ss) {
                if (err) return o.err('DATABASE').out();
                var s = ss.sections.find(s => s._id.equals(sectionId));
                return o.set('section', s).out();
            });
        });
    });
}


module.exports = { post };
