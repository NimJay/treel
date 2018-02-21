const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;

/**
 * Retrieve the Classe with the specified _id, along with its Sections.
 */
function post(req, res) {
    postOutput(req, res, o => o.out());
}

function postOutput(req, res, cb) {

    getLoggedInUser(req, function (err, user) {

        var o = new Output(res);
        var { classeId } = req.body;
        if (classeId === undefined)
            return cb(o.err('MISSING_POST'));

        var Classe = mongoose.model('Classe');
        Classe
            .findById(classeId)
            .populate('instructors')
            .populate('school')
            .exec(function (err, classe) {
                if (err) return cb(o.err('DATABASE'));
                if (!classe) return cb(o.err('INVALID_INPUT'));

                // TODO: Handle Classe privacy for logged-in Users.
                if (classe.isPrivate && !user)
                    return cb(o.err('INVALID_INPUT'));

                o.set('classe', classe);
                return findSections(o, cb, classe);
            }
        );
    });
}


function findSections(o, cb, classe) {
    var Sections = mongoose.model('Sections');
    Sections.findOne({ 'classe': classe.id },
        function (err, sections) {
            if (err) return cb(o.err('DATABASE'));
            if (!sections) return cb(o.err());
            return cb(o.set('sections', sections));
        }
    );
}


module.exports = { post, postOutput };
