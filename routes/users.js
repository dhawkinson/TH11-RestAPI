'use strict';

//  library modules
const express        = require('express');
const router         = express.Router();

//  local modules
const {User}         = require('../models/user');
const {authenticate} = require('../middleware/authenticate');

/*==================================================
    USER ROUTES
==================================================*/
//   POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', (req, res, next) => {
    User.create(req.body, (err, user) => {
        //  catches items with missing data
        if (!user.fullName || !user.emailAddress || !user.password) {
            err.status = 400;
            return next(err);
        }
        //  catches all other errors
        if (err) {
            if (err.name === "Mongo Error" && err.code === 11000) {
                err = new Error('That email is taken, you must use a different valid email address');
                err.status = 400;
                return next(err);
            } else {
                return next(err);
            }
        }
        //  the happy path
        res.location('/');
        res.status(201).json();
    });
});
//  GET / 200 - Returns the currently authenticated user
router.get('/', authenticate, (req, res) => {
    if (res) {
        res.json(req.authenticatedUser);
        res.status(200);
    } else {
        
    }
});

module.exports = router;