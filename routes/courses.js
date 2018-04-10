'use strict';

var express          = require('express');
var router           = express.Router();
const _              = require('lodash');
const bodyParser     = require('body-parser');
const {ObjectID}     = require('mongodb');

//  local modules
const {User}         = require('./../models/user');
const {Course}       = require('./../models/course');
const {Review}       = require('./../models/review');
const {authenticate} = require('./../middleware/authenticate');

/*==================================================
    COURSE ROUTES
==================================================*/
//      GET /courses 200 - Returns the Course "_id" and "title" properties
/*router.get('/courses', authenticate, (req, res) => {
        res.send(req.user);
    });
//      GET /course/:courseId 200 - Returns all Course properties and related documents for the provided course ID
router.get('/courses/:courseId', authenticate, (req, res) => {
        res.send(req.user);
    });
//      POST /courses 201 - Creates a course, sets the Location header, and returns no content
router.post('/courses', async (req, res) => {
        try {
            const body = _.pick(req.body, ['email', 'password']);
            const user = new User(body);
            await user.save();
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send(user); //  send custom header (x-)
        } catch(e) {
            res.status(400).send(e);
        }
    });
//      PATCH /courses/:courseId 204 - Updates a course and returns no content
router.patch('/courses/:courseId', async (req, res) => {
    try {
        // something
    } catch(e) {
        res.status(400).send(e);
    }

});
//      POST /courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/courses/courseId/reviews', async (req, res) => {
        try {
            const body = _.pick(req.body, ['email', 'password']);
            const user = new User(body);
            await user.save();
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send(user); //  send custom header (x-)
        } catch(e) {
            res.status(400).send(e);
        }
});

module.exports = router;*/