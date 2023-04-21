const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MetaModelSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  type: { type: String },
  name: { type: String },
  approachUsed: { type: String },
  heuristic: { type: String },
  user_id: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const MetaModel = mongoose.model("MetaModel", MetaModelSchema);
module.exports = MetaModel;
