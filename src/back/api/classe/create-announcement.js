const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const Emailer = require('../util/Emailer.js');
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;


function post(req, res) {

    let o = new Output(res), // The JSON output.
        Classe = mongoose.model('Classe');

    // Gather input.
    var { classeId, isEmail, text } = req.body;
    var required = [classeId, isEmail, text];
    if (required.some(a => a === undefined))
        return o.err('MISSING_POST').out();

    // Validate input.
    let m = null;
    if (!text || text.length < 10) m = 'Text too short.';
    else if (text.length > 2000) m = 'Text too short.';
    else if (typeof(isEmail) !== 'boolean') m = 'Invalid isEmail';
    else if (!mongoose.Types.ObjectId.isValid(classeId)) m = 'Invalid classeId';
    if (m) return o.err('INVALID_INPUT', m).out();

    // Must be logged in.
    getLoggedInUser(req, function (err, user) {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Retrieve Classe.
        Classe.findById(classeId, function (err, classe) {
            if (err) return o.err('DATABASE').out();
            if (!classe) return o.err('INVALID_INPUT').out();

            // Must be creator or instructor.
            if (!classe.creator.equals(user._id) &&
                classe.instructors.every(i => !i.equals(user._id)))
                return o.err().out();

            createAnnouncement(o, text, isEmail, user, classe);
        });
    });
}

// Create Announcement.
function createAnnouncement(o, text, isEmail, user, classe) {
    let Announcement = mongoose.model('Announcement');
    a = new Announcement({ text, isEmail });
    a.classe = classe._id;
    a.creator = user._id;

    a.save((err, savedA) => {
        if (err || !savedA) return o.err('DATABASE').out();
        o.set('announcement', savedA);
        if (!isEmail) return o.out();
        email(o, text, user, classe);
    });
}

// Announce by emailing StudentList.
function email(o, text, user, classe) {
    let Follow = mongoose.model('Follow');
    Follow
        .find({ classe: classe._id })
        .populate('user')
        .exec((err, follows) => {
            if (err) return o.err('DATABASE').out();
            if (!follows || follows.length == 0) {
                o.set('numAccepted', 0);
                o.set('rejected', []);
                return o.out();
            }

            // Email!
            emails = follows.map(f => f.user.email);
            Emailer.announce(text, user, classe, emails,
                (err, accepted, rejected) => {
                    if (err || !accepted || !rejected)
                        return o.err().out();
                    o.set('numAccepted', accepted.length);
                    o.set('rejected', rejected);
                    return o.out();
                }
            );
        }
    );
}


module.exports = { post };
