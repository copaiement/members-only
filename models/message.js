const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: { type: String, required: true },
  username: { type: String, required: true },
  addedDate: { type: Date, required: true },
});

MessageSchema.virtual('addedDate_formatted').get(function () {
  return DateTime.fromJSDate(this.added).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model('Message', MessageSchema);