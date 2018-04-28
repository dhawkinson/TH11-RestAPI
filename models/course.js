'use strict';

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    //  sets user to an ObjectId that references the User model (user)
    //  ref: ...docs/api.html#schema_Schema.Types
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Title required!']
    },
    description: {
        type: String,
        required: [true, 'Description required!']
    },
    estimatedTime: {type: String},
    materialsNeeded: {type: String},
    steps: [{
        stepNumber: {type: Number},
        title: {
            type: String, 
            required: [true, 'Step Title required!']
            },
        description: {
            type: String, 
            required: [true, 'Step Description required!']
            }
    }],
    //  sets reviews to an array of ObjectIds that reference the Review model (review)
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = { Course };
