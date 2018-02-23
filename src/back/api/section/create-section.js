const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;

function post(req, res) {

    getLoggedInUser(req, function (err, user) {

        var o = new Output(res);
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Gather input.
        var { classeId, name, isAtTop } = req.body;
        if ([classeId, name, isAtTop].some(a => a === undefined))
            return o.err('MISSING_POST').out();

        // Validate input.
        if (typeof(name) !== 'string' || name.lenth > 50)
            return o.err('INVALID_INPUT', 'Invalid name.').out();
        if (!mongoose.Types.ObjectId.isValid(classeId))
            return cb(o.err('INVALID_INPUT', 'Invalid classeId.'));
        if (typeof(isAtTop) !== 'boolean')
            return o.err('INVALID_INPUT', 'Invalid isAtTop.').out();

        var Sections = mongoose.model('Sections');
        Sections.findOne({ classe: classeId }, function (err, sections) {
            if (err) return o.err('DATABASE').out();
            if (!sections)
                return o.err('INVALID_INPUT', 'Invalid classeId.').out();

            // Append or prepend.
            var s = { name };
            if (isAtTop) sections.sections.unshift(s);
            else sections.sections.push(s);
            sections.save(function (err) {
                if (err) return o.err('DATABASE').out();
                return o.set('section', s).out();
            });
        });
    });
}


module.exports = { post };
