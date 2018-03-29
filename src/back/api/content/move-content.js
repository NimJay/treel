const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const { getLoggedInUser } = require('../util/Global.js');


function post (req, res) {

    let o = new Output(res),
        Sections = mongoose.model('Sections');

    // Input.
    let { classeId, sectionId, contentId, isMoveUp } = req.body;
    if ([classeId, sectionId, contentId, isMoveUp].some(a => a === undefined))
        return o.err('MISSING_POST').out();

    // Validate some input.
    if (!mongoose.Types.ObjectId.isValid(classeId))
        return o.err('INVALID_INPUT', 'Invalid classeId.').out();
    if (!mongoose.Types.ObjectId.isValid(sectionId))
        return o.err('INVALID_INPUT', 'Invalid sectionId.').out();
    if (!mongoose.Types.ObjectId.isValid(contentId))
        return o.err('INVALID_INPUT', 'Invalid contentId.').out();
    if (typeof(isMoveUp) !== 'boolean')
        return o.err('INVALID_INPUT', 'Invalid isMoveUp.').out();

    // Must be logged in.
    getLoggedInUser(req, (err, user) => {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Retrieve Sections.
        Sections.findOne({ classe: classeId }, (err, ss) => {
            if (err) return o.err('DATABASE').out();
            if (!ss) return o.err('INVALID_INPUT', 'Invalid classeId.').out();
            return getClasse(o, sectionId, contentId, isMoveUp, user, ss);
        });
    });
}


// Retrieve Classe.
function getClasse(o, sectionId, contentId, isMoveUp, user, ss) {
    let Classe = mongoose.model('Classe');
    Classe.findById(ss.classe, (err, classe) => {
        if (!classe) return o.err('DATABASE').out();

        // Must be creator or instructor.
        if (!classe.creator.equals(user._id) &&
            classe.instructors.every(i => !i.equals(user._id)))
            return o.err('INVALID_INPUT').out();

        return moveContent(o, sectionId, contentId, isMoveUp, ss);
    });
}


// Move, save, and output.
function moveContent(o, sectionId, contentId, isMoveUp, ss) {
    // Locate the Section.
    let i = ss.sections.findIndex(s => s._id.equals(sectionId));
    if (i == -1)
        return o.err('INVALID_INPUT', 'Invalid sectionId.').out();

    // Locate the Content.
    let j = ss.sections[i].contents.findIndex(c => c._id.equals(contentId));
    if (j == -1)
        return o.err('INVALID_INPUT', 'Invalid contentId.').out();

    // Move.
    var content = ss.sections[i].contents[j];
    if (isMoveUp && j != 0) {
        ss.sections[i].contents[j] =
            ss.sections[i].contents.splice(j - 1, 1, content)[0];
    } else if (!isMoveUp && j < ss.sections[i].contents.length - 1) {
        ss.sections[i].contents[j] =
            ss.sections[i].contents.splice(j + 1, 1, content)[0];
    } else {
        return o.err('INVALID_INPUT').out();
    }

    ss.save(function (err, ss) {
        if (err) return o.err('DATABASE').out();
        return o.out();
    });
}


module.exports = { post };
