const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const Fingerprint = require("express-fingerprint");
const Audit = require("./models/audit");
// const cloudinary = require('cloudinary');

const recipeRoutes = require("./routes/recipes");

const mongoUrl = process.env.MONGODB_URL;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

const uriPrefix = "/api/v1";

// use express for application/json
app.use(express.json());

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

app.use((req, res, next) => {
  const path = req.protocol + "://" + req.headers.host + req.originalUrl;
  const audit = new Audit({
    ipAddress: req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
    path: path,
  });
  audit.save();
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
  .connect(mongoUrl)
  .then((result) => {
    app.listen("8080");
  })
  .catch((err) => console.log(err));
