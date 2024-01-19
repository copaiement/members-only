const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

// Virtual for book's URL
MessageSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/book/${this._id}`;
});

MessageSchema.virtual('post_date_formatted').get(function () {
  return DateTime.fromJSDate(this.added).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model('Message', MessageSchema);