const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const { getLoggedInUser, isValidContent } = require('../util/Global.js');


function post (req, res) {

    let o = new Output(res),
        Sections = mongoose.model('Sections');

    // Input.
    let { classeId, sectionId, contentId } = req.body;
    if ([classeId, sectionId, contentId].some(a => a === undefined))
        return o.err('MISSING_POST').out();

    // Validate some input.
    if (!mongoose.Types.ObjectId.isValid(classeId))
        return o.err('INVALID_INPUT', 'Invalid classeId.').out();
    if (!mongoose.Types.ObjectId.isValid(sectionId))
        return o.err('INVALID_INPUT', 'Invalid sectionId.').out();
    if (!mongoose.Types.ObjectId.isValid(contentId))
        return o.err('INVALID_INPUT', 'Invalid contentId.').out();

    // Must be logged in.
    getLoggedInUser(req, (err, user) => {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Retrieve Sections.
        Sections.findOne({ classe: classeId }, (err, ss) => {
            if (err) return o.err('DATABASE').out();
            if (!ss) return o.err('INVALID_INPUT', 'Invalid classeId.').out();
            return getClasse(o, sectionId, contentId, user, ss);
        });
    });
}


// Retrieve Classe.
function getClasse(o, sectionId, contentId, user, ss) {
    let Classe = mongoose.model('Classe');
    Classe.findById(ss.classe, (err, classe) => {
        if (!classe) return o.err('DATABASE').out();

        // Must be creator or instructor.
        if (!classe.creator.equals(user._id) &&
            classe.instructors.every(i => !i.equals(user._id)))
            return o.err('INVALID_INPUT').out();

        return deleteContent(o, sectionId, contentId, ss);
    });
}


// Delete, save, and output Content.
function deleteContent(o, sectionId, contentId, ss) {
    // Locate the Section.
    let s = ss.sections.id(sectionId);
    if (!s) return o.err('INVALID_INPUT', 'Invalid sectionId.').out();

    // Locate the Content.
    let c = s.contents.id(contentId);
    if (!c) return o.err('INVALID_INPUT', 'Invalid contentId.').out();

    // Remove Content.
    c.remove();
    ss.save(err => {
        if (err) o.err('DATABASE');
        return o.out();
    });
}


module.exports = { post };
