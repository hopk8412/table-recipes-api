const express = require("express");
const { body } = require("express-validator");
const multer = require('multer');
const { v4: uuidv4} = require('uuid');
const recipeController = require('../controllers/recipes');

const router = express.Router();

// Allow only specified image types to be uploaded
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage: fileStorage, fileFilter: fileFilter });
// GET /api/v1/recipes
router.get('/recipes', recipeController.getRecipes);

// GET /api/v1/recipes/:id
router.get('/recipes/:id', recipeController.getRecipe);

// POST /api/v1/recipes
router.post('/recipes', upload.array('images'), recipeController.postRecipe);

// PUT /api/v1/recipes/:id
router.put('/recipes/:id', recipeController.putRecipe);

// DELETE /api/v1/recipes/:id
router.delete('/recipes/:id', recipeController.deleteRecipe);

module.exports = router;