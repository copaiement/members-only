const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UpgradeSchema = new Schema({
  memberPass: { type: String, required: true },
  adminPass: { type: String, required: true },
});

// Export model
module.exports = mongoose.model('Upgrade', UpgradeSchema);