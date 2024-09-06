'use strict';

const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Rolled db connector
const dbtest = require('./database/pgp_db').dbheader;

dotenv.config();

const app = express();

// Using a local variable for the database connection.
app.locals.db = dbtest();

app.use(cors());
app.use(express.json());

app.disable('x-powered-by');

// Locations for v1.0 files:
const v1data = require('./v1.0/routes/data'); // default route
const v1apps = require('./v1.0/routes/apps'); // apps API routes

app.use(express.static('public'));
app.use(express.urlencoded({
  extended: false,
}));
app.use(express.json());

// use the v1.5 endpoints:
app.use('/v1.0/data', v1data);
app.use('/v1.0/apps', v1apps);

// in production, port is 3001 and server started in script 'www'
// The variable is stored in the gitignored `.env` file.
// This is managed in the www folder.
if (process.env.NODE_ENV === 'development') {
  app.listen(3005);
}

module.exports = app;
