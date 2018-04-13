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


function sendVerification(email, code, callback) {

    let link = `${CONFIG.URL}/verify/${code}`,
		html = `
<div style="font-size: 20px;font-family: sans-serif;text-align: center;padding: 50px 10px;">
    <a style="font-family: sans-serif;display: inline-block;font-size: 26px;background-color: #70dc52;color: #266715;padding: 20px;text-decoration: none;border-radius: 5px;" href="${link}">Verify Email</a>
    <p style="font-family: sans-serif;font-size: 20px;">Click on the button above to verify your email address.</p>
    <p style="font-family: sans-serif;font-size: 16px;">Or visit this link: <a href="${link}">${link}</a></p>
</div>`;

    let options = {
        'from': `Treel <${CONFIG.EMAIL}>`,
        'to': email,
        'subject': 'Treel — Email Verification',
        'html': html
    };

    transporter.sendMail(options, callback ? (err, info) => {
        if (err || !info) callback(err, null, null);
        callback(err, info.accepted);
    } : null);
}


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


module.exports = { announce, sendVerification };
