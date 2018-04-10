'use strict';

//  load library modules
const express      = require('express');
//const expect       = require('chai').expect;
const expect       = require('expect');
const request      = require('supertest');

//  load local modules
const seed         = require('../middleware/seed');
const {Course}     = require('../models/course');
const {Review}     = require('../models/review');
const {User}       = require('../models/user');
require('colors');

const app          = express();


//  seed CourseRateAPITest
app.use(seed);

describe('[---USER routes---]'.yellow, (done) => {

    
});

describe('[---COURSE routes---]'.yellow, (done) => {

    
});