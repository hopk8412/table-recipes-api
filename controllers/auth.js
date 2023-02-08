const HttpStatusCodes = require("http-status-codes");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const dotenv = require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET

exports.register = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation error');
        error.statusCode = HttpStatusCodes.StatusCodes.BAD_REQUEST;
        error.data = errors.array();
        throw error;
    }
    const emailAddress = req.body.emailAddress;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            password: hashedPass
        });
        return user.save();
    })
    .then((result) => {
        res.status(HttpStatusCodes.StatusCodes.CREATED).json({message: 'Account successfully created!', userId: result._id});
    })
    .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = HttpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(err);
    });
};

exports.login = (req, res, next) => {
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;
    let loadedUser;
    User.findOne({emailAddress: emailAddress}).then((user) => {
        if (!user) {
            const error = new Error('User with this email not found!');
            error.statusCode = HttpStatusCodes.StatusCodes.UNAUTHORIZED;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then((isEqual) => {
        if (!isEqual) {
            const error = new Error('Username or password was incorrect.');
            error.statusCode = HttpStatusCodes.StatusCodes.UNAUTHORIZED;
            throw error;
        }
        //valid user and authenticated successfully
        const token = jwt.sign(
            {
                emailAddress: loadedUser.emailAddress,
                userId: loadedUser._id.toString()
            },
            jwtSecret,
            {expiresIn: "1h"}
        );
        res.status(HttpStatusCodes.StatusCodes.OK).json({token: token, userId: loadedUser._id.toString()});
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = HttpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(err);
    });

};