'use strict';

const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');      //  Used bcryptjs rather than bcrypt. Reported to have less problems across browsers (per Andrew Mead)

//  define the User model
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true
    },
    emailAddress: {
        type: String,
        required: [true, 'Email is required and must have a minimum length of 1'],
        trim: true,
        minlength: 1,
        unique: [true, 'The email address is already taken'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
});

/*========================================
    NOTE TO SELF: instance methods (UserSchema.methods) - none used (see 07node-todo-api for reference)
========================================*/

/*========================================
    model methods (UserSchema.statics)
========================================*/

UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({ emailAddress: email }, (err, user) => {
        if (err) {
            return callback(err);
        } else if (!user) {
            let err = new Error();
            err.message = 'User with that email not found';
            err.status = 404;
            return callback(err);
        }
        // validate password (password = entered password, user.password = hashed password)
        bcrypt.compare(password, user.password, (err, res) => {
            if (res === true) {
                return callback(null, user);
            } else {
                let err = new Error();
                err.message = 'User password not validated';
                err.status = 401;
                return callback(err);
            }
        });
    });
};

UserSchema.pre('save', function(next) {
    let user = this;

    //  only re-hash the password if it has been changed
    if ( user.isModified('password') ) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User     = mongoose.model('User', UserSchema);

module.exports = {User};
