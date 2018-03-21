const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;
const FILES_DIR = require('../../Config.js').FILES_DIR;


function post(req, res) {

    let o = new Output(res),
        Classe = mongoose.model('Classe'),
        File = mongoose.model('File');

    // Check input.
    if (!req.files || !req.files.file || !req.body.classeId)
        return o.err('MISSING_POST').out();
    let file = req.files.file,
        classeId = req.body.classeId;

    // Must be logged in.
    getLoggedInUser(req, (err, user) => {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Validate.
        file.name = file.name.replace(/ /g,"_");
        if (!mongoose.Types.ObjectId.isValid(classeId))
            return o.err('INVALID_INPUT', 'Invalid classeId').out();
        Classe.findById(classeId, (err, classe) => {
            if (err) return o.err('DATABASE').out();
            if (!classe) return o.err('INVALID_INPUT').out();

            // Must be creator/instructor.
            if (!classe.creator.equals(user._id) &&
                !classe.instructors.some(i => i.equals(user._id)))
                return o.err().out();

            // Create Mongo File object.
            fileObject = new File({
                classe: classe._id, name: file.name, mimeType: file.mimetype
            });
            fileObject.save((err, newFile) => {
                if (err) return o.err('DATABASE').out();
                if (!newFile) return o.err('INVALID_INPUT').out();

                // Save the actual file.
                file.mv(FILES_DIR + newFile._id, (err) => {
                    if (err) return o.err('GENERIC', 'Failed to save').out();
                    o.set('file', newFile).out();
                });
            });
        });
    });
}

module.exports = { post };
