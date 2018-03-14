const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;


function post(req, res) {

    var Classe = mongoose.model('Classe'),
        Follow = mongoose.model('Follow'),
        o = new Output(res);

    getLoggedInUser(req, (err, user) => {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Gather and validate input.
        var { classeId } = req.body;
        if (!classeId) return o.err('MISSING_POST').out();
        if (!mongoose.Types.ObjectId.isValid(classeId))
            return cb(o.err('INVALID_INPUT', 'Invalid classeId'));

        // Retrieve the Classe.
        Classe.findById(classeId, (err, classe) => {
            if (err) return o.err('DATABASE').out();
            if (!classe) return o.err('INVALID_INPUT').out();

            // Remove Follow.
            Follow.remove({ classe: classe._id, user: user._id },
                (err, follow) => {
                    if (err) return o.err('DATABASE').out();
                    return o.out(); // Success!
                }
            );
        });
    });
}


module.exports = { post };
