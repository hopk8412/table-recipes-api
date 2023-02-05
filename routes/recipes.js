const express = require("express");
const { body } = require("express-validator");
const multer = require('multer');
const uuid = require('uuid');
const recipeController = require('../controllers/recipes');

const router = express.Router();

// GET /api/v1/recipes
router.get('/recipes', recipeController.getRecipes);

// GET /api/v1/recipes/:id
router.get('/recipes/:id', recipeController.getRecipe);

// POST /api/v1/recipes
router.post('/recipes', recipeController.postRecipe);

// PUT /api/v1/recipes/:id
router.put('/recipes/:id', recipeController.putRecipe);

// DELETE /api/v1/recipes/:id
router.delete('/recipe/:id', recipeController.deleteRecipe);

module.exports = router;