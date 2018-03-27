const mongoose = require('mongoose'),
    { Output } = require('../util/Output.js'),
    { getLoggedInUser } = require('../util/Global.js');


function post(req, res) {

    let o = new Output(res),
        Classe = mongoose.model('Classe'),
        File = mongoose.model('File');

    // Input.
    let { classeId } = req.body;
    if (!classeId) return o.err('MISSING_POST').out();
    if (!mongoose.Types.ObjectId.isValid(classeId))
        return o.err('INVALID_INPUT').out();

    // Must be logged in.
    getLoggedInUser(req, (err, user) => {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Retrieve Classe.
        Classe.findById(classeId, (err, classe) => {
            if (err) return o.err('DATABASE').out();
            if (!classe) return o.err('INVALID_INPUT').out();

            // Must be creator or instructor.
            if (!classe.creator.equals(user._id) &&
                classe.instructors.every(i => !i.equals(user._id)))
                return o.err('INVALID_INPUT').out();

            // Retrieve and output Files.
            File.find({ classe: classe._id }, (err, files) => {
                if (err) return o.err('DATABASE').out();
                return o.set('files', files).out();
            });
        });
    });
}


module.exports = { post };
