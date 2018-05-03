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
    User.findOne({ emailAddress: req.body.emailAddress })
        .exec((err, user) => {
            if (user) {
                err = new Error();
                err.message = 'That email is already in use';
                err.status = 400;
                return next(err);
            } else {
                User.create(req.body, function (err, user) {
                    if (!user.emailAddress || !user.fullName || !user.password) {
                        err.status = 400;
                        return next(err);
                    }
                    if (err) {
                        return next(err);
                    } else {
                        res.location('/');
                        res.status(201).json();
                    }

                });
            }
        });
});
//  GET / 200 - Returns the currently authenticated user
router.get('/', authenticate, (req, res) => {
    //  find all ({}), bring back course_id & title ('course_id title')
    //  see (http://mongoosejs.com/docs/queries.html)
    //  NOTE: I'm not bringing back the password for security reasons, even though it is hashed
    //      if you feel the need to verify that the password is there, change the string to 'user_id fullName emailAddress password'/save and rerun
    /*User.findOne({ emailAddress: req.authenticatedUser }, 'user_id fullName emailAddress', (err, users) => {
        if (err) {
            err.status = 400;   //  Bad Request
            return next(err);
        }
        res.status = 200;       //  OK
        res.json(users);
    });*/
    res.json(req.authenticatedUser);
    res.status(200);

});

module.exports = router;