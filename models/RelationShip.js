const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RelationShipSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  To: { type: String },
  From: { type: String },
  type: { type: String },
  metamodel_id:{type:String},
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const RelationShip = mongoose.model("RelationShip", RelationShipSchema);
module.exports = RelationShip;
