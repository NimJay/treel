const CONFIG = {
    'PORT': 3003,
    'MONGO_URI': 'mongodb://localhost:27017/treel',
    'FILES_DIR': __dirname + '/file/',

    // Treel requires an SMPT email account to deliver all emails.
    'EMAIL': 'treel.app@gmail.com',
    'EMAIL_PASSWORD': 'machinelearning95G'
};

module.exports = CONFIG;
