'use strict';

//  load library modules
const express    = require('express');
const expect     = require('chai').expect;
const request    = require('supertest');
const util       = require('util');
const colors     = require('colors');
const seeder     = require('mongoose-seed');    //  NOTE: rejected "mongoose-seeder" because it seems to be out of sync with mongodb

//  load local modules
const {Course}   = require('../models/course');
const {Review}   = require('../models/review');
const {User}     = require('../models/user');
const {seed}     = require('../middleware/seed');
const {data}     = require('../data/data.js');
const config     = require('../config/config.js');

const app        = express;

describe('[---USER routes---]'.yellow, () => {
    
    describe('POST /api/users'.green, () => {

        it('should create a user with complete information'.cyan, () =>{
            request(app)
                .post('/api/users')
                .set('Content-Type', 'application/json/')
                .send({
                    fullName: 'John Smith', 
                    emailAddress: 'john@smith.com', 
                    password: 'password'
                })
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        return err;
                    }

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
                            err = new Error();
                            err.message = 'The email address is already taken';
                            err.status = 400;
                            return next(err);
                        }
                    });
                    expect(res.body).toBeTruthy();
                });
        });

        it('should reject a user with incomplete information'.cyan, function(){
            request(app)
                .post('/api/users')
                .set('Content-Type', 'application/json/')
                //  Note: password is missing
                .send({
                    fullName: 'Dilbert Gilbert', 
                    emailAddress: 'dilbert@gilbert.com'
                })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return err;
                    }

                    expect(res.body).toBeFalsy();
                });
        });

        it('should reject a user with a duplicate emailAddress'.cyan, function(){
            request(app)
                .post('/api/users')
                .set('Content-Type', 'application/json/')
                .send({
                    fullName: 'Joe Smith', 
                    emailAddress: 'joe@smith.com', 
                    password: 'password'
                })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return err;
                    }
                });
        });
    });

    describe('GET /api/users'.green, (done) => {

        it('should return a user with credentialed information'.cyan, function(done){
            const emailAddress = "joe@smith.com";
            request(app)
                .get('/')
                .set('Authorization', process.env.AUTHORIZATION)
                .send({emailAddress})
                .expect(200)
                
                .expect((res) => {
                    expect(res.body.emailAddress).toBe(emailAddress);
                })
                .end((err, resp) => {
                    if (err) {
                        return done(err);
                    }
                    let credentials;
                    User.findByCredentials(credentials.email, credentials.pass, (err, user) => {
                        if ( err || !user ) {
                            const err = new Error('User not found with those credentials');
                            err.status = 404;
                            return next(err);
                        } else {
                            req.authenticatedUser = user;
                            done();
                        }
                    }).catch((e) => done(e));
                    expect(res.body).toBe(user);
                });
            done();
        });

        it('should reject a user that is unauthorized'.cyan, function(done){
            const id = "57029ed4795118be119cc437";
            const query = { _id: id };
            request(app)
                .get('/api/users')
                .send({id})
                .expect(401)
                
                .expect((res) => {
                    expect(res.body._id).toBe(id);
                })
                .end((err, resp) => {
                    if (err) {
                        return done(err);
                    }
                    User.find(query, (err, user) => {
                        expect(user).toBeFalsy();
                        done();
                    }).catch((e) => done(e));
                });
            done();
        });
    });
});

describe('[---COURSE routes---]'.yellow, (done) => {

});

