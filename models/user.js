'use strict';

const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

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
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


/*========================================
    instance methods
========================================*/

//  set the exact values to send back to the user
UserSchema.methods.toJSON  = function() {
    let user       = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'fullName', 'emailAddress']);    //  limit the data being sent back to only public data
};

UserSchema.methods.generateAuthToken = function() {
    let user   = this;
    let access = 'auth';
    let token  = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    // user.tokens.push({access, token})    -   deprecated method (see next)
    user.tokens = user.tokens.concat([{access, token}]);    // mitigates problem encountered between MongoDB versions

    //  save the item, passing token into the then callback (next middleware)
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

/*========================================
    model methods
========================================*/
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }
    //  success
    return User.findOne({
        '_id': decoded._id,
        // looking within the tokens array, hence the wrapper of ''
        'tokens.token': token,
        'tokens.access': 'auth'
    })
};

UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;

    return User.findOne({email}).then((user) => {
        if ( !user ) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if ( res ) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function(next) {
    let user = this;

    //  only re-hash the password if is has been changed
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
