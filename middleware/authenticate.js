'use strict';

const auth   = require('basic-auth');
const {User} = require('../models/user');

const authenticate = (req, res, next) => {
    //  Get the basic auth credentials from the given request. 
    //  The Authorization header is parsed and if the header is invalid, undefined is returned, (fail)
    //  otherwise an object with name and pass properties is returned.  (succeed)
    const credentials = auth(req);
    console.log(credentials.name, credentials.pass);
    if (credentials) {
        User.authenticate(credentials.name, credentials.pass, (err, user) => {
            if ( err || !user ) {
                let err = new Error();
                err.message = 'No credentialed user found';
                err.status = 401;
                return next(err);
            } else {
                req.authenticatedUser = user;
                return next();
            }
        });
    } else {
        let err = new Error();
        err.message = 'Unauthorized, you must sign in';
        err.status = 401;
        return next(err);
    }
};

module.exports = {authenticate};