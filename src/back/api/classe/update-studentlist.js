const isemail = require('isemail');
const mongoose = require('mongoose');
const getLoggedInUser = require('../util/Global.js').getLoggedInUser;
const Output = require('../util/Output.js').Output;


function post(req, res) {

    var o = new Output(res),
        Access = mongoose.model('Access'),
        Classe = mongoose.model('Classe'),
        StudentList = mongoose.model('StudentList');

    // Must be logged in.
    getLoggedInUser(req, function (err, user) {
        if (err) return o.err('DATABASE').out();
        if (!user) return o.err('NOT_LOGGED_IN').out();

        // Gather input.
        var { classeId, studentList } = req.body;
        if (classeId === undefined || studentList === undefined)
            return o.err('MISSING_POST').out();

        // Validate input.
        if (studentList.length > 30000)
            return o.err('INVALID_INPUT', 'studentList too long.').out();
        if (!mongoose.Types.ObjectId.isValid(classeId))
            return o.err('INVALID_INPUT', 'Invalid classeId').out();

        // Validate provided classeId.
        Classe.findById(classeId, (err, classe) => {
            if (err) return o.err('DATABASE').out();
            if (!classe) return o.err('INVALID_INPUT', 'Invalid classeId');

            // Remove all Accesses for the Classe.
            Access.remove({ classe: classe._id }, (err) => {
                if (err) return o.err('DATABASE').out();

                // Retrieve StudentList, and create new if does not exist.
                StudentList.findOne({ classe: classeId }, (err, sl) => {
                    if (err) return o.err('DATABASE').out();
                    if (!sl) sl = new StudentList({ classe: classe._id });

                    // Update and save.
                    sl.studentList = studentList;
                    sl.save((err, savedSl) => {
                        if (err) return o.err('DATABASE').out();
                        o.set('savedSl', savedSl); // TODO: Remove line.
                        createAccesses(o, classe, savedSl.studentList);
                    });
                });
            });
        });
    });
}

// Create an Access for each email.
function createAccesses(o, classe, studentList) {
    var Access = mongoose.model('Access'),
        emails = studentList
            .split(/[\s,]/)
            .filter(isemail.validate)
            .map(e => e.toLowerCase()),
        as = emails.map(a => {return { 'email': a, 'classe': classe._id }});
    Access.create(as, (err, as) => {
        if (err) return o.err('DATABASE').out();
        o.set('accesses', as).out();
    });
    createFollows(classe, emails);
}

// Create a Follow for each User. Note: This happens after the JSON output.
function createFollows(classe, emails) {
    var Follow = mongoose.model('Follow'),
        User = mongoose.model('User');
    User.find({ email: { $in: emails }}, (err, users) => {
        if (err || !users || users.length == 0) return;

        /**
         * If private Classe, kick off all Followers.
         * If public Classe, kick off studentList to avoid duplicate Follows.
         */
        var query = { classe: classe._id };
        if (!classe.isPrivate) query.user = users.map(u => u._id);
        Follow.remove(query, err => {
            if (err) return;

            // Create Follows.
            var fs = users.map(u =>
                {return { classe: classe._id, user: u._id }});
            Follow.create(fs);
        });
    });
}


module.exports = { post };
