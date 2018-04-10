const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const { getLoggedInUser, isValidContent } = require('../util/Global.js');


function post (req, res) {

    let o = new Output(res),
        Sections = mongoose.model('Sections');

    // Input.
    let { classeId, sectionId, content } = req.body;
    if ([classeId, sectionId, content].some(a => a === undefined))
        return o.err('MISSING_POST').out();

    // Validate some input.
    if (!mongoose.Types.ObjectId.isValid(classeId))
        return o.err('INVALID_INPUT', 'Invalid classeId.').out();
    if (!mongoose.Types.ObjectId.isValid(sectionId))
        return o.err('INVALID_INPUT', 'Invalid sectionId.').out();
    if (!isValidContent(content) ||
        !mongoose.Types.ObjectId.isValid(content._id))
        return o.err('INVALID_INPUT', 'Invalid content.').out();

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

        return updateContent(o, sectionId, content, ss);
    });
}


// Delete, save, and output Content.
function updateContent(o, sectionId, content, ss) {
    // Locate the Section.
    let s = ss.sections.id(sectionId);
    if (!s) return o.err('INVALID_INPUT', 'Invalid sectionId.').out();

    // Locate the Content.
    let c = s.contents.id(content._id);
    if (!c) return o.err('INVALID_INPUT', 'Invalid content._id.').out();

    // Update Content.
    if (c.type == 'text') {
        c.text = content.text;
    } else if (c.type == 'link') {
        c.link = content.link;
        c.name = content.name;
        c.description = content.description;
    } else if (c.type == 'file') {
        c.name = content.name;
        c.description = content.description;
    }

    ss.save((err, savedSs) => {
        if (err) o.err('DATABASE');
        let s = savedSs.sections.id(sectionId);
        if (!s) return o.err().out();
        let c = s.contents.id(content._id);
        if (!c) return o.err().out();
        return o.set('content', c).out();
    });
}


module.exports = { post };
