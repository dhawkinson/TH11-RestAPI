'use strict';

//  load library modules
const express      = require('express');
//const expect       = require('chai').expect;
const expect       = require('expect');
const request      = require('supertest');

//  load local modules
const seed         = require('../src/middleware/seed');
const {Course}     = require('../src/models/course');
const {Review}     = require('../src/models/review');
const {User}       = require('../src/models/user');
require('colors');

const app          = express();


//  seed CourseRateAPITest
app.use(seed);

describe('[---USER routes---]'.yellow, (done) => {

    
});

describe('[---COURSE routes---]'.yellow, (done) => {

    
});