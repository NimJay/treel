const mongoose = require('mongoose');
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
    var userSchema = mongoose.Schema({
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
    var UserModel = mongoose.model('User', userSchema);
}

module.exports = { connect };
