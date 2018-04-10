'use strict';

const mongoose = require('mongoose');

const Course   = mongoose.model('Course', {
    user: {
        type: mongoose.Schema.Types.ObjectId,   // ref: ...docs/api.html#schema_Schema.Types
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
    reviews: [{
        //  sets reviews to an array of ObjectIds that reference the Review model (reviews)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});


module.exports = {Course};
