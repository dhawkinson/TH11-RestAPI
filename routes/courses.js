'use strict';

//  library modules
const express        = require('express');
const router         = express.Router();
const _              = require('lodash');
const { ObjectID }   = require('mongodb');
const mongoose       = require('mongoose');

//  local modules
const {User}         = require('../models/user');
const {Course}       = require('../models/course');
const {Review}       = require('../models/review');
const {authenticate} = require('../middleware/authenticate');

/*==================================================
    COURSE ROUTES
==================================================*/
//  GET /api/courses 200 - Returns the Course "_id" and "title" properties -- working
router.get('/', (req, res, next) => {
    //  find all ({}), bring back course_id & title ('course_id title')
    //  see (http://mongoosejs.com/docs/queries.html)
    Course.find({}, 'course_id title', (err, courses) => {
        if ( err ) {
            err.status = 400;   //  Bad Request
            return next(err);
        }
        //  end of the route
        res.status = 200;       //  OK
        res.json(courses);
    });
});
//  GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
router.get('/:courseID', (req, res, next) => {

    Course
        .findById(req.params.courseID)
        .populate({ path: 'user', select: 'fullName' })
        .populate({ path: 'reviews', populate: { path: 'user', model: 'User', select: 'fullName' } })
        .exec ( (err, course) => {

            if (err) {
                err.status = 400;   //  Bad Request
                return next(err);
            }
            //  end of the route
            res.status = 200;       //  OK
            res.json(course);
        });
});
//  POST /api/courses 201 - Creates a course, sets the Location header, and returns no content -- working
router.post('/', authenticate, function(req, res, next) {
    //  see (http://mongoosejs.com/docs/models.html)
    Course.create(req.body, (err) => {
        if (err) {
            err.status = 400;   //  Bad Request
            return next(err);
        }
        res.location('/');
        res.status(201).json(); //  Created
    });
});
//  PUT /api/courses/:courseId 204 - Updates a course and returns no content
router.put('/:courseID', authenticate, function(req, res, next) {
    Course.findByIdAndUpdate(req.params.courseID, req.body, function(err) {
        if (err) {
            err.status = 400;      //  Bad Request
            return next(err);
        }
        res.body = req.body;
        res.status(204).json();    //   No Content
    });
});
//  POST /api/courses/:courseId/reviews 201
//  Creates a review for the specified course ID, 
//  sets the Location header to the related course, and returns no content
router.post('/:courseID/reviews', authenticate, (req, res, next) => {
    //  reject an unauthenticated user
    if ( !req.authenticatedUser ) {
        const err = new Error();
        err.message = 'You are not an Authorized user';
        err.status = 401;
        return next(err)
    }
    //  create the review -- must perform first because review._id is required to update course
    Review.create(req.body, (err, review) => {
        if (err) {
            err.status = 400;
            return next(err);
        }
        //  update the review to the course
        Course.findByIdAndUpdate(req.params.courseID, { $push: { reviews: review._id } })
            .populate('user')
            .exec(function (err, course) {
                if (err) {
                    return next(err);
                }
                //  test course for self review and do not allow
                if (req.authenticatedUser._id.toString() === course.user._id.toString()) {
                    let err = new Error();
                    err.message = "You are not authorized to review your own course";
                    err.status = 401;
                    return next(err);
                }
            });
            res.location('/:courseID');
            res.status(201).json();
    });
});

module.exports = router;
