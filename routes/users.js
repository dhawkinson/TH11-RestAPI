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
    User.findOne({emailAddress:req.body.emailAddress}, (err, user) => {

        if ( err ) throw err;

        if( !user ){
            User.create(req.body, function (err, user) {
                if(!user.emailAddress || !user.fullName || !user.password){
                    err.status = 400;
                    return next(err);
                }
                if (err){
                    return next(err);
                } else{
                    res.location('/');
                    res.status(201).json();
                }

            });
        } else {
            err = new Error('That email already exists');
            err.status = 400;
            return next(err);
        }
    });
});
//  GET / 200 - Returns the currently authenticated user
router.get('/api/users', authenticate, (req, res) => {
    res.json(req.authenticatedUser);
    //res.status(200);
});

module.exports = router;