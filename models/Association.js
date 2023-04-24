const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssociationSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  To: { type: String },
  From: { type: String },
  metamodel_id:{type:String},
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const Association = mongoose.model("Association", AssociationSchema);
module.exports = Association;
