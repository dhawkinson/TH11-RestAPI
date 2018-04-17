'use strict';

const auth   = require('basic-auth');
const {User} = require('../models/user');

const authenticate = (req, res, next) => {
    //  Get the basic auth credentials from the given request. 
    //  The Authorization header is parsed and if the header is invalid, undefined is returned, (fail)
    //  otherwise an object with name and pass properties.  (succeed)
    const credentials = auth(req);

    if ( credentials ) {
        User.findByCredentials(credentials.email, credentials.pass, (err, user) => {
            if ( err || !user ) {
                const err = new Error('User not found with those credentials');
                err.status = 404;
                return next(err);
            } else {
                req.authenticatedUser = user;
                next();
            }
        });
    } else {
        err = new Error('You are not authorized, you must sign in');
        err.status = 401;
        return next(err);
    }
};

module.exports = {authenticate};