var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the user schema
var TaskSchema = new Schema({
  staff_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'staff'
  },
  taskname : { type: String }, 
  sdate:{ type: Date },
  edate:{ type: Date },
  approval:{ type: String , default: "Denied" },
  status : { type: String , default: "Pending" }
});

TaskSchema.pre('save', function(next) {
  if (this.approval === 'Denied') {
    delete this.status;
  }
  next();
});

module.exports = mongoose.model('task',TaskSchema);