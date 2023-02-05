const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditSchema = new Schema({
  fingerprint: {
    type: mongoose.SchemaTypes.Mixed,
    required: true
  },
  path: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);