const CONFIG = {
    'PORT': 8080,
    'MONGO_URI': 'mongodb://localhost:27017/treel',
    'FILES_DIR': __dirname + '/file/',
    'URL': 'http://localhost:8080',

    // Treel requires an SMTP email account to deliver all emails.
    'EMAIL': 'treel.app@gmail.com',
    'EMAIL_PASSWORD': 'machinelearning95G',
    'EMAIL_ENABLED': false
};

module.exports = CONFIG;
