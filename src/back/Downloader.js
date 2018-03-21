const fs = require('fs');
const mongoose = require('mongoose');
const getLoggedInUser = require('./api/util/Global.js').getLoggedInUser;
const FILES_DIR = require('./Config.js').FILES_DIR;

function sendError(res, message) {
    if (!message) message = 'Sorry, something went wrong.';
    res.send(`<html>${message}</html>`);
}
function sendNotFound(res, message) {
    return sendError(res, 'This file is either non-existent or is private.');
}

function download(req, res) {

    let fileId = req.params.fileId,
        Access = mongoose.model('Access'),
        Classe = mongoose.model('Classe'),
        File = mongoose.model('File');

    // Retrieve File.
    File.findById(fileId, (err, file) => {
        if (err) return sendError(res);
        if (!file) return sendNotFound(res);

        // Retrieve Classe.
        Classe.findById(file.classe, (err, classe) => {
            if (err || !classe) return sendError(res);
            if (!classe.isPrivate)
                return sendFile(res, file);

            // Retrieve logged-in User.
            getLoggedInUser(req, (err, user) => {
                if (err) return sendError(res);
                if (!user) return sendNotFound(res);

                // Instructor or creator?
                let isCreator = classe.creator.equals(user._id),
                    isInstructor = classe.
                        instructors.some(i => i.equals(user._id));
                if (isCreator || isInstructor) return sendFile(res, file);

                // Check Access.
                Access.findOne({ email: user.email, classe: classe._id },
                    (err, access) => {
                        if (err) return sendError(res);
                        if (!access) return sendNotFound(res);
                        return sendFile(res, file);
                    }
                );
            });
        });
    });
}

function sendFile(res, file) {
    fs.stat(FILES_DIR + file._id, function(err, stat) {
        if (err) return sendError(res);
        return res.download(FILES_DIR + file._id, file.name);
    });
}

module.exports = { download };
