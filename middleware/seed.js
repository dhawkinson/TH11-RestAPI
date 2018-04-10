'use strict';

//  library modules
const seeder     = require('mongoose-seed');    //  NOTE: rejected "mongoose-seeder" because it seems to be out of sync with mongodb

//  local modules
const {data}     = require('./../data/data.js');
const config     = require('../../config/config.js');

/*==================================================
    build seeding Courses, Reviews, Users
==================================================*/

// declare seeding
function seedDB() {
    seeder.connect(process.env.MONGODB_URI, () => {
        console.log(`Connected to: ${process.env.MONGODB_URI} and seeding files`);
    
        // Load Mongoose models
        seeder.loadModels([
            'src/models/user.js',
            'src/models/review.js',
            'src/models/course.js'
        ]);
        
        // Clear specified collections
        seeder.clearModels(['User', 'Review', 'Course'], function() {
            // Callback to populate DB once collections have been cleared
            seeder.populateModels(data, function() {
                seeder.disconnect();
            });
        });
    });
}

//  execute seeding
seedDB();

const seed = (req, res, next) => {
    seedDB(next());
};

module.exports = seed;