const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

// POST /api/v1/auth/register
router.post('/auth/register', [
    body('emailAddress').isEmail().withMessage('Please enter a valid email address.').custom((value, { req }) => {
        return User.findOne({emailAddress: value}).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists.');
            }
        });
    }).normalizeEmail(),
    body('password').trim().isLength({min: 8}),
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty()
], authController.register);

// POST /api/v1/auth/login
router.post('/auth/login', authController.login);

// TODO: PUT /api/v1/auth/users/:id for account update

module.exports = router;