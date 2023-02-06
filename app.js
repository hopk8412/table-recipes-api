const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const parser = require('body-parser');
const Fingerprint = require('express-fingerprint');
// const cloudinary = require('cloudinary');

const recipeRoutes = require('./routes/recipes');

const mongoUrl = process.env.MONGODB_URL;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

const uriPrefix = '/api/v1';

// basic fingerprinting for audit logs
// app.use(Fingerprint({
//     parameters: [
//         Fingerprint.useragent,
//         Fingerprint.acceptHeaders,
//         Fingerprint.geoip
//     ]
// }));


// use body-parser for application/json
app.use(parser.json());

// Resolve CORS issues
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

// Routes

app.use(uriPrefix, recipeRoutes);

// TODO: implement auth logic
// app.use(uriPrefix, authRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

mongoose
  .connect(
    mongoUrl
  )
  .then((result) => {
    app.listen("8080");
  })
  .catch((err) => console.log(err));
