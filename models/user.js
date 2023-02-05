const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type:
      {
        type: String,
        required: true,
      },
  },
  password: {
    type: String,
    required: true,
  },
  recipes: {
    type: [{
        type: Schema.Types.ObjectId, 
        ref: 'Recipe',
        required: false
    }]
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
