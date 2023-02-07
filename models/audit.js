const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditSchema = new Schema({
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);