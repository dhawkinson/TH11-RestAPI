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
    //  find course by Id ({}), bring back course_id & title ('course_id title')
    //  see (http://mongoosejs.com/docs/queries.html)
    //  and (http://mongoosejs.com/docs/populate.html)
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
router.put('/:courseId', authenticate, function(req, res, next) {
    Course.findByIdAndUpdate(req.body._id, req.body, function(err) {
        if (err) {
            err.status = 400;      //  Bad Request
            return next(err);
        }
        console.log('Update Courses: ',req.body);
        res.body = req.body;
        res.status(204).json();    //   No Content
    });
});
//  POST /api/courses/:courseId/reviews 201
//  Creates a review for the specified course ID, 
//  sets the Location header to the related course, and returns no content
/*==================================================
    not Working yet
==================================================*/

router.post('/:courseId/reviews', authenticate, (req, res, next) => {
    if (req.auth) {
        const reviewData = {
            user: req.user._id,
            rating: req.body.rating,
            review: req.body.review
        };
        Review.create(reviewData, (err, review) => {
            if (err) {
                return next(err);
            } else {
                Course.findByIdAndUpdate(req.params.courseId, {$push: {reviews: review._id}}, (err, course) => {
                    if (err) {
                        return next(err);
                    } else {
                        res.status(201)
                            .location("/api/courses/" + req.body._id)
                            .end();
                    }
                });
            }
        });
    } else {
        let err = new Error();
        err.message = 'You may not review your own course';
        err.status = 401;   //  Unauthorized
        return next(err);
    }

});
/*router.=>post('/:courseID/reviews', authenticate, (req, res, next) => {
    //  first, exclude self reviews
    console.log('Authenticated user:', req.authenticatedUser._id.toString(), 'Response User:', res.user._id.toString());
    if (req.authenticatedUser._id.toString() === res.user._id.toString()) {
        let err = new Error();
        err.message = 'You may not review your own course';
        err.status = 401;   //  Unauthorized
        return next(err);
    }
    //  second, create the Review document
    const reviewData = {
        user: req.user._id,
        rating: req.body.rating,
        review: req.body.review
    };
    Review.create(reviewData, (err, review) => {
        if (err) {
            return next(err);
        } else {
            //  third, push the review on to the course
            //  see (http://mongoosejs.com/docs/subdocs.html)
            Course.findByIdAndUpdate(req.params.courseId, { $push: { reviews: review._id } }, (err, course) => {
                if (err) {
                    return next(err);
                } else {
                    res.location('/:courseID');
                    res.status(201).json();
                }
            });
        }
    });
});*/

module.exports = router;