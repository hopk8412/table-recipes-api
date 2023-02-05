const HttpStatusCodes = require("http-status-codes");
const { validationResult } = require("express-validator");
//replace below with recipe model
const Recipe = require('../models/recipe');

exports.getRecipes = (req, res, next) => {
  console.log("Getting all recipes...");
  const currentPage = req.query.page || 1;
  const limit = req.query.limit || 3;
  let totalCount;
  Recipe.find().countDocuments()
  .then(count => {
    totalCount = count;
    return Recipe.find().skip((currentPage - 1) * limit).limit(limit);
  })
  .then(recipes => {
    console.log('Successfully fetched recipes!');
    res.status(HttpStatusCodes.StatusCodes.OK).json({
        message: 'Successfully fetched recipes!',
        recipes: recipes,
        pageNumber: currentPage,
        limit: limit,
        total: totalCount
    });
  })
  .catch(err => {
    if (!err.statusCode) {
        error.statusCode = HttpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
    }
    next(err);
  });

};

exports.getRecipe = (req, res, next) => {
  console.log("Getting recipe by id...");
  const id = req.params.id;
  Recipe.findById(id).then(recipe => {
    if (!recipe) {
        const error = new Error('Recipe not found!');
        error.statusCode = HttpStatusCodes.StatusCodes.NOT_FOUND;
        throw error;
    }
    res.status(HttpStatusCodes.StatusCodes.OK).json({
        message: 'Found recipe!',
        recipe: recipe
    })
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = HttpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
    }
    next(err);
  });
};

exports.postRecipe = (req, res, next) => {
  console.log("Creating new recipe...");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed for new recipe...');
    error.statusCode = HttpStatusCodes.StatusCodes.FORBIDDEN;
    throw error;
  }
  const title = req.body.title;
  const ingredients = req.body.ingredients;
  //const imageUrl = req.body.imageUrl;
  const instructions = req.body.instructions;

  const recipe = new Recipe({
    title: title,
    ingredients: ingredients,
    instructions: instructions
  });
  recipe.save().then(result => {
    console.log(result);
    res.status(HttpStatusCodes.StatusCodes.CREATED).json({
        message: 'Recipe created successfully!',
        recipe: result
    });
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = HttpStatusCodes.StatusCodes.INTERNAL_SERVER_ERROR;
    }
    next(err);
  });
};

exports.putRecipe = (req, res, next) => {
  console.log("Updating a recipe...");
};

exports.deleteRecipe = (req, res, next) => {
  console.log("Deleting a recipe...");
};
