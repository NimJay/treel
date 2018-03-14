const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;


function post(req, res) {

    var Classe = mongoose.model('Classe'),
        Access = mongoose.model('Access'),
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

            // Must have Access to Private Classes.
            if (classe.isPrivate) {
                Access.findOne({ email: user.email, classe: classe._id },
                    (err, access) => {
                        if (err) return o.err('DATABASE').out();
                        if (!access) return o.err('INVALID_INPUT').out();
                        createFollow(o, classe, user);
                    }
                );
            } else createFollow(o, classe, user);
        });
    });
}


function createFollow(o, classe, user) {
    var Follow = mongoose.model('Follow');

    // Check if Follow already exists.
    Follow.findOne({ classe: classe._id, user: user._id }, (err, follow) => {
        if (err) return o.err('DATABASE').out();
        if (follow) return o.set('follow', follow).out();

        // Create and save the Follow.
        var follow = new Follow({ classe: classe._id, user: user._id });
        follow.save((err, newFollow) => {
            if (err) return o.err('DATABASE').out();
            o.set('follow', newFollow).out();
        });
    });
}


module.exports = { post };
