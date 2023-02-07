const HttpStatusCodes = require("http-status-codes");
const { validationResult } = require("express-validator");
const Recipe = require("../models/recipe");
const fs = require('fs');
const path = require('path');

exports.getRecipes = (req, res, next) => {
  console.log("Getting all recipes...");
  const currentPage = req.query.page || 1;
  const limit = req.query.limit || 3;
  let totalCount;
  Recipe.find()
    .countDocuments()
    .then((count) => {
      totalCount = count;
      return Recipe.find()
        .skip((currentPage - 1) * limit)
        .limit(limit);
    })
    .then((recipes) => {
      console.log("Successfully fetched recipes!");
      res.status(HttpStatusCodes.StatusCodes.OK).json({
        message: "Successfully fetched recipes!",
        recipes: recipes,
        pageNumber: currentPage,
        limit: limit,
        total: totalCount,
      });
    })
    .catch((err) => next(handleCatchErrors(err)));
};

exports.getRecipe = (req, res, next) => {
  console.log("Getting recipe by id...");
  const id = req.params.id;
  Recipe.findById(id)
    .then((recipe) => {
      if (!recipe) {
        const error = new Error("Recipe not found!");
        error.statusCode = HttpStatusCodes.StatusCodes.NOT_FOUND;
        throw error;
      }
      res.status(HttpStatusCodes.StatusCodes.OK).json({
        message: "Found recipe!",
        recipe: recipe,
      });
    })
    .catch((err) => next(handleCatchErrors(err)));
};

exports.postRecipe = (req, res, next) => {
  console.log("Creating new recipe...");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed for new recipe...");
    error.statusCode = HttpStatusCodes.StatusCodes.FORBIDDEN;
    throw error;
  }
  const title = req.body.title;
  const ingredients = req.body.ingredients;
  let images = [];
  if (req.files) {
    images = req.files.map((image) => image.path.replace("\\", "/"));
  }
  const instructions = req.body.instructions;
  const notes = req.body.notes;

  const recipe = new Recipe({
    title: title,
    images: images,
    ingredients: ingredients,
    instructions: instructions,
    additionalNotes: notes,
  });
  recipe
    .save()
    .then((result) => {
      console.log(result);
      res.status(HttpStatusCodes.StatusCodes.CREATED).json({
        message: "Recipe created successfully!",
        recipe: result,
      });
    })
    .catch((err) => next(handleCatchErrors(err)));
};

exports.putRecipe = (req, res, next) => {
  console.log("Updating a recipe...");
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    const error = new Error("Validation for updated recipe failed!");
    error.statusCode(HttpStatusCodes.StatusCodes.FORBIDDEN);
    throw error;
  }
  const title = req.body.title;
  const ingredients = req.body.ingredients;
  const instructions = req.body.instructions;
  const notes = req.body.notes;
  let images = [];
  if (req.files) {
    images = req.files.map((image) => image.path.replace("\\", "/"))
  }
  Recipe.findById(id)
    .then((recipe) => {
      if (!recipe) {
        console.log("No recipe found with given ID: ", id);
        const error = new Error("No recipe found for ID " + id + "!");
        error.statusCode = HttpStatusCodes.StatusCodes.NOT_FOUND;
        throw error;
      }
      /* Since this is a PUT, whether or not images are specified, the previous recipe images will be removed */
      recipe.title = title;

      if (recipe.images) {
        clearImage(recipe.images);
      }
      recipe.images = images;

      recipe.ingredients = ingredients;
      recipe.instructions = instructions;
      recipe.additionalNotes = notes;
      return recipe.save();
    })
    .then((result) => {
      res.status(HttpStatusCodes.StatusCodes.OK).json({
        message: "Recipe with ID " + id + " updated successfully!",
        recipe: result,
      });
    })
    .catch((err) => next(handleCatchErrors(err)));
};

exports.deleteRecipe = (req, res, next) => {
  console.log("Deleting a recipe...");
  const id = req.params.id;
  Recipe.findById(id)
    .then((recipe) => {
      if (!recipe) {
        const error = new Error("Could not find a recipe with id: " + id);
        error.statusCode = HttpStatusCodes.StatusCodes.NOT_FOUND;
        throw error;
      }
      if (recipe.images) {
        clearImage(recipe.images);
      }
      return Recipe.findByIdAndRemove(id);
    })
    .then((result) => {
      console.log(result);
      res.status(HttpStatusCodes.StatusCodes.OK).json({
        message: "Recipe with ID " + id + " was deleted successfully!",
      });
    })
    .catch((err) => next(handleCatchErrors(err)));
};

function handleCatchErrors(err) {
  if (!err.statusCode) {
    err.statusCode = HttpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
  }
  return err;
}

const clearImage = (imagePaths) => {
  imagePaths.forEach((filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
  });
};
