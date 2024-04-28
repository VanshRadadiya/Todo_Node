var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the user schema
var AdminSchema = new Schema({
  name : { type: String},
  email : { type: String }, 
  password: { type: String } 
});

module.exports = mongoose.model('admin', AdminSchema);