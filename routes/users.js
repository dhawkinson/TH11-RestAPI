'use strict';

//  library modules
const express        = require('express');
const router         = express.Router();
const _              = require('lodash');
const bodyParser     = require('body-parser');
const {ObjectID}     = require('mongodb');

//  local modules
const {User}         = require('./../models/user');
const {authenticate} = require('./../middleware/authenticate');

/*==================================================
    USER ROUTES
==================================================*/
//   POST /users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});
//  GET /users 200 - Returns the currently authenticated 
router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});
//  POST /users 200 - login a valid user
router.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(400).send();
    }
});
//  POST /users 200 - logout a user and remove the token
router.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e) {
        res.status(400).send();
    }
});

module.exports = router;