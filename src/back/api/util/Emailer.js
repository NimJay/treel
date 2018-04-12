const isemail = require('isemail');
const nodemailer = require('nodemailer');
const CONFIG = require('../../Config.js');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: CONFIG.EMAIL,
        pass: CONFIG.EMAIL_PASSWORD
    }
});


function announce(text, user, classe, emails, callback) {

    emails = emails
        .filter(isemail.validate)
        .map(e => e.toLowerCase());

    let options = {
        'from': `${user.name} <${CONFIG.EMAIL}>`,
        'to': emails,
        'replyTo': user.email,
        'subject': `${classe.courseCode}`,
        'text': text
    };

    transporter.sendMail(options, (err, info) => {
        if (err || !info) callback(err, null, null);
        callback(err, info.accepted, info.rejected);
    });
}


module.exports = { announce };
