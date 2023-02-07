const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  images: {
    type: [{
      type: String,
      required: false
    }]
  },
  ingredients: {
    type: [{
        type: String,
        required: true
    }]
  },
  instructions: {
    type: [
      {
        type: String,
        required: true
      },
    ],
  },
  additionalNotes: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);