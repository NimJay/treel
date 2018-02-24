const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;

function post(req, res) {

    getLoggedInUser(req, function (err, user) {

        var o = new Output(res);
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Gather input.
        var { classeId, sectionId, isMoveUp } = req.body;
        if ([classeId, sectionId, isMoveUp].some(a => a === undefined))
            return o.err('MISSING_POST').out();

        // Validate input.
        if (typeof(isMoveUp) !== 'boolean')
            return o.err('INVALID_INPUT', 'Invalid isMoveUp.').out();
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

            // Move.
            var temp = ss.sections[i];
            if (isMoveUp) {
                // Move up until a non-deleted Section is swapped.
                var aboveWasDeleted = true;
                while (i > 0 && aboveWasDeleted) {
                    aboveWasDeleted = ss.sections[i - 1].isDeleted;
                    ss.sections[i] =
                        ss.sections.splice(i - 1, 1, ss.sections[i])[0];
                    i--;
                }
            } else {
                // Move down until a non-deleted Section is swapped.
                var belowWasDeleted = true;
                while (i < ss.sections.length - 1 && belowWasDeleted) {
                    belowWasDeleted = ss.sections[i + 1].isDeleted;
                    ss.sections[i] =
                        ss.sections.splice(i + 1, 1, ss.sections[i])[0];
                    i++;
                }
            }

            // Save.
            ss.save(function (err, sss) {
                if (err) return o.err('DATABASE').out();
                return o.out();
            });
        });
    });
}


module.exports = { post };
