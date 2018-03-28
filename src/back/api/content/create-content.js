const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const { getLoggedInUser, isValidContent } = require('../util/Global.js');


function post (req, res) {

    let o = new Output(res),
        Sections = mongoose.model('Sections');

    // Input.
    let { classeId, sectionId, content } = req.body;
    if ([classeId, sectionId, content].some(a => !a))
        return o.err('MISSING_POST').out();

    // Validate some input.
    if (!mongoose.Types.ObjectId.isValid(classeId))
        return cb(o.err('INVALID_INPUT', 'Invalid classeId.'));
    if (!mongoose.Types.ObjectId.isValid(sectionId))
        return cb(o.err('INVALID_INPUT', 'Invalid sectionId.'));

    // Must be logged in.
    getLoggedInUser(req, (err, user) => {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Retrieve Sections.
        Sections.findOne({ classe: classeId }, (err, ss) => {
            if (err) return o.err('DATABASE').out();
            if (!ss) return o.err('INVALID_INPUT', 'Invalid classeId.').out();
            return getClasse(o, sectionId, content, user, ss);
        });
    });
}


// Retrieve Classe.
function getClasse(o, sectionId, content, user, ss) {
    let Classe = mongoose.model('Classe');
    Classe.findById(ss.classe, (err, classe) => {
        if (!classe) return o.err('DATABASE').out();

        // Must be creator or instructor.
        if (!classe.creator.equals(user._id) &&
            classe.instructors.every(i => !i.equals(user._id)))
            return o.err('INVALID_INPUT').out();

        return createContent(o, sectionId, content, ss);
    });
}


// Create, save, and output new Content.
function createContent(o, sectionId, content, ss) {
    // Locate the Section.
    var i = ss.sections.findIndex(s => s._id.equals(sectionId));
    if (i == -1)
        return o.err('INVALID_INPUT', 'Invalid sectionId.').out();

    // Create and save.
    let c = content;
    ss.sections[i].contents.push(c);
    if (!isValidContent(c)) return o.err('INVALID_INPUT').out();
    ss.save(function (err, ss) {
        if (err) return o.err('DATABASE').out();
        let s = ss.sections.find(s => s._id.equals(sectionId));
        return o.set('content', s.contents[s.contents.length - 1]).out();
    });
}


module.exports = { post };
