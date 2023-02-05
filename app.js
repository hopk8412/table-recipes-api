const express = require('express');
const dotenv = require('dotenv').config();
const parser = require('body-parser');

const app = express();

const uriPrefix = '/api/v1';

// use body-parser for application/json
app.use(parser.json());





// console.log('process.local.env contains: ', process.env);
console.log('mongodb connection string is: ', process.env.MONGODB_URL);


app.listen('8080');