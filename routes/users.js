'use strict';

//  library modules
const express        = require('express');
const router         = express.Router();
const mongoose       = require('mongoose');

//  local modules
const {User}         = require('../models/user');
const {authenticate} = require('../middleware/authenticate');

/*==================================================
    USER ROUTES
==================================================*/
//   POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', (req, res, next) => {
    //  see (http://mongoosejs.com/docs/models.html)
    User.create(req.body, (err, user) => {
        //  catches items with missing data
        if (!user.fullName || !user.emailAddress || !user.password) {
            err.status = 400;   //  Bad Request
            return next(err);
        }
        //  catches all other errors
        if (err) {
            if (err.name === "Mongo Error" && err.code === 11000) {
                err = new Error();
                err.message
                err.status = 400;   //  Bad Request
                return next(err);
            } else {
                return next(err);
            }
        }
        //  the happy path
        res.location('/');
        res.status(201).json(); //  Created
    });
});
//  GET / 200 - Returns the currently authenticated user
router.get('/', authenticate, (req, res) => {
    //  find all ({}), bring back course_id & title ('course_id title')
    //  see (http://mongoosejs.com/docs/queries.html)
    //  NOTE: I'm not bringing back the password for security reasons, even though it is hashed
    //      if you feel the need to verify that the password is there, change the string to 'user_id fullName emailAddress password'/save and rerun
    User.findOne({}, 'user_id fullName emailAddress', (err, users) => {
        if (err) {
            err.status = 400;   //  Bad Request
            return next(err);
        }
        res.status = 200;       //  OK
        res.json(users);
    });
});

module.exports = router;