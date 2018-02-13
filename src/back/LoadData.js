const mongoose = require('mongoose');
const { connect } = require('./Mongo.js');

connect(function (db) {

    var School = mongoose.model('School');
    School.remove({}, function (err) {
        if (err) {
            console.log('Error: Failed to remove existing Schools.');
            return db.close();
        }
        School.create([
            { name: 'University of Toronto', country: 'Canada' },
            { name: 'University of Toronto Scarborough', country: 'Canada' },
            { name: 'University of Toronto Mississauga', country: 'Canada' },
            { name: 'York University', country: 'Canada' },
            { name: 'University of Waterloo', country: 'Canada' }
        ], function (err, schools) {
            if (err) console.log('Error: Failed to create Schools.');
            db.close();
        });
    });
});
