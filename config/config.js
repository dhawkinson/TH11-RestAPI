'use strict';
/*==================================================
    Module determines the environment from process.env
    Based on the environment (being either "development" or "test" ), it then sets additional environment variables:
        PORT
        MONGODB_URI
        JWT_SECRET
        AUTHORIZATION
    from config.json
==================================================*/
const env = process.env.NODE_ENV || 'development';

if ( env === 'development' || env === 'test' ) {
    let config = require('./config.json');
    let envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}