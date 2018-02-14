const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;

function post(req, res) {
    var o = new Output(res);
    var School = mongoose.model('School');
    School.find({}, function (err, schools) {
        if (err || !schools) return o.err('DATABASE').out();
        o.set('schools', schools).out();
    });
}

module.exports = { post };
