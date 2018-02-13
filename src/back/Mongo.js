const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const MongoClient = require('mongodb').MongoClient;


var db = null;


function connect(callback) {
    if (db) return callback(db);
    mongoose.connect('mongodb://localhost:27017/treel');
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

    // Class
    var classSchema = Schema({
        courseCode: String,
        courseName: String,
        term: String,
        isPrivate: Boolean,
        school: { type: Schema.Types.ObjectId, ref: 'School' },
        instructors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        creator: { type: Schema.Types.ObjectId, ref: 'User' }
    });
    mongoose.model('Class', classSchema);
}


module.exports = { connect };
