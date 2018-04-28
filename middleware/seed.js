'use strict';

//  library modules
const seeder = require('mongoose-seed');    //  NOTE: rejected "mongoose-seeder" because it seems to be out of sync with mongodb
const util   = require('util');

//  local modules
const {data} = require('../data/data.js');
const config = require('../config/config.js');

/*==================================================
    build seeding Courses, Reviews, Users
==================================================*/

const seedDB = (req, res, next) => {
    seeder.connect(process.env.MONGODB_URI, (err, db) => {
        console.log(`Connected to: ${process.env.MONGODB_URI} and seeding files`);
    
        // Load Mongoose models
        seeder.loadModels([
            'models/user.js',
            'models/review.js',
            'models/course.js'
        ]);
        
        // Clear specified collections
        seeder.clearModels(['User', 'Review', 'Course'], function() {
            // Callback to populate DB once collections have been cleared
            seeder.populateModels(data, function() {
                //seeder.disconnect();  //  do we really want to disconnect? We will just have to reconnect.
            });
        });
        if (err) {
            err = new Error();
            err.message = 'Seeding failed';
            err.status = 500;
            return next(err);
        }
    });
};

//  execute seeding
seedDB();

const seed = (req, res, next) => {
    seedDB(next());
};


module.exports = {seed};