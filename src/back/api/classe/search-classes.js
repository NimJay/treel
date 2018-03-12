const mongoose = require('mongoose');
const Output = require('../util/Output.js').Output;
const regexEscape = require('escape-string-regexp');

/**
 * Output all the Classes that match a certain searchString.
 * Note: Currently, there is a limit of 100 Classes retrieved.
 */
function post(req, res) {
    var o = new Output(res),
        searchString = req.body.searchString;

    if (!searchString) return o.set('classes', []).out();

    var regex = getRegex(searchString);
    var Classe = mongoose.model('Classe');
    Classe
        .find({ $or: [
            {'courseCode' : { $regex: regex, $options: 'i' }},
            {'courseName' : { $regex: regex, $options: 'i' }}]})
        .limit(100)
        .populate('school')
        .populate('instructors')
        .exec(function (err, classes) {
            if (err || !classes) return o.err('DATABASE').out();
            o.set('classes', classes).out();
        }
    );
}

// Given a searchString, return the corresponding regex.
function getRegex(searchString) {
    ss = searchString // " ab c? "
        .trim() // "ab c?"
        .split(/\s+/) // ["ab", "c?"]
        .map(regexEscape) // ["ab", "c\?"]
        .join('|'); // "csc|209\+"
    return new RegExp(ss);
}

module.exports = { post };
