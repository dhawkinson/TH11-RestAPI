'use strict';

//  load library modules
const express = require('express');
const expect = require('chai').expect;
const request = require('supertest');
const colors = require('colors');
const seeder = require('mongoose-seed');    //  NOTE: rejected "mongoose-seeder" because it seems to be out of sync with mongodb

require('colors');

//  load local modules
const {Course} = require('../models/course');
const {Review} = require('../models/review');
const {User}   = require('../models/user');
const {data}   = require('../data/data.js');
const config   = require('../config/config.js');

const app        = express;

describe('[===SEED the Database===]'.green, () => {

    before( (done) => {
        
        seeder.connect('mongodb://localhost:27017/CourseRateAPITest', (err, db) => {
            console.log(`Connected to: mongodb://localhost:27017/CourseRateAPITest and seeding files`);

            // Load Mongoose models
            seeder.loadModels([
                'models/user.js',
                'models/review.js',
                'models/course.js'
            ]);

            // Clear specified collections
            seeder.clearModels(['User', 'Review', 'Course'], function () {
                // Callback to populate DB once collections have been cleared
                seeder.populateModels(data, function () {
                    //seeder.disconnect(); do we really want to disconnect, the tests are coming right behind

                    done();
                });
            });
            if (err) {
                err = new Error('Seeding failed');
                err.status = 500;
                return next(err);
            }
        });
    });
    describe('[---USER routes---]'.yellow, () => {

        describe('GET /api/users'.magenta, (done) => {

            it('should return a user with credentialed information'.cyan, function (done) {
                const emailAddress = "joe@smith.com";
                request(app)
                    .get('/')
                    .set('Authorization', process.env.AUTHORIZATION)
                    .send({ emailAddress })
                    .expect(200)

                    .expect((res) => {
                        expect(res.body.emailAddress).toBe(emailAddress);
                    })
                    .end((err, resp) => {
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
                        expect(res.body).toBe(user);
                    });
                done();
            });

            it('should reject a user that is unauthorized'.cyan, function (done) {
                const id = "57029ed4795118be119cc437";
                const query = { _id: id };
                request(app)
                    .get('/api/users')
                    .send({ id })
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
});
