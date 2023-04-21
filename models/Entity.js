const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EntitySchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  attribute: { type: Array },
  cardinalty: { type: String },
  relationShip: { type: String },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const Entity = mongoose.model("Entity", EntitySchema);
module.exports = Entity;
