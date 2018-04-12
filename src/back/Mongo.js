const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const MongoClient = require('mongodb').MongoClient;
const MONGO_URI = require('./Config').MONGO_URI;


var db = null;


function connect(callback) {
    if (db) return callback(db);
    mongoose.connect(MONGO_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Mongoose connection.'));
    db.once('open', function() {
        console.log('Mongoose connected');
        return callback(db);
    });
    loadSchemas();
}


function loadSchemas() {

    // User
    var userSchema = Schema({
        email: String,
        passwordHash: String,
        type: Number,
        name: String
    },{
        toJSON: {
            transform: function (doc, ret) {
                delete ret.passwordHash;
            }
        }
    });
    mongoose.model('User', userSchema);

    // School
    var schoolSchema = Schema({
        name: String,
        country: String,
        creator: { type: Schema.Types.ObjectId, ref: 'User' }
    });
    mongoose.model('School', schoolSchema);

    // Classe
    var classeSchema = Schema({
        courseCode: String,
        courseName: String,
        term: String,
        isPrivate: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        school: { type: Schema.Types.ObjectId, ref: 'School' },
        instructors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        creator: { type: Schema.Types.ObjectId, ref: 'User' }
    });
    mongoose.model('Classe', classeSchema);

    // Content
    var contentSchema = Schema({
        type: String,
        text: String,
        link: String,
        name: String,
        description: String,
        file: { type: Schema.Types.ObjectId, ref: 'File' }
    });

    // Section
    var sectionSchema = Schema({
        name: String,
        isDeleted: { type: Boolean, default: false },
        contents: [contentSchema]
    });

    // Sections
    var sectionsSchema = Schema({
        sections: [sectionSchema],
        classe: { type: Schema.Types.ObjectId, ref: 'Classe' }
    });
    mongoose.model('Sections', sectionsSchema);

    // StudentList
    var studentListSchema = Schema({
        classe: { type: Schema.Types.ObjectId, ref: 'Classe', index: true },
        studentList: { type: String }
    });
    mongoose.model('StudentList', studentListSchema);

    // Access
    var accessSchema = Schema({
        email: { type: String, index: true },
        classe: { type: Schema.Types.ObjectId, ref: 'Classe' }
    });
    mongoose.model('Access', accessSchema);

    // Follow
    var followSchema = Schema({
        classe: { type: Schema.Types.ObjectId, ref: 'Classe' },
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    });
    mongoose.model('Follow', followSchema);

    // File
    var file = Schema({
        classe: { type: Schema.Types.ObjectId, ref: 'Classe' },
        name: { type: String },
        mimeType: { type: String }
    });
    mongoose.model('File', file);

    // Announcement
    var announcement = Schema({
        text: { type: String },
        creator: { type: Schema.Types.ObjectId, ref: 'User' },
        classe: { type: Schema.Types.ObjectId, ref: 'Classe' },
        isEmail: { type: Boolean },
    }, { timestamps: { createdAt: 'timeCreated', updatedAt: 'timeUpdated' } });
    mongoose.model('Announcement', announcement);
}


module.exports = { connect };
