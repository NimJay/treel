const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUserId = require('../util/Global.js').getLoggedInUserId;


function post(req, res) {

    var Classe = mongoose.model('Classe');
    var School = mongoose.model('School');
    var o = new Output(res);

    var userId = getLoggedInUserId(req);
    if (!userId) return o.err('NOT_LOGGED_IN').out();

    // Find the Classes created/instructed by User.
    Classe.find(
        { $or: [ { creator: userId }, { instructors: userId } ] },
        function (err, classes) {
            if (err) return o.err('DATABASE').out();
            o.set('classes', classes);

            // Gather relevant Schools.
            var sIds = classes.map(c => c.school);
            School.find({ _id: { $in: sIds } }, function (err, schools) {
                if (err) return o.err('DATABASE').out();
                return o.set('schools', schools).out();
            });
        }
    );
}


module.exports = { post };
