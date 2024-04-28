var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the user schema
var staffSchema = new Schema({
  name : { type: String},
  username : { type: String },
  password : { type: String },
  post: { type: String }
});

module.exports = mongoose.model('staff',staffSchema);