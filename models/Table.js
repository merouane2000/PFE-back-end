const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  attribute: { type: Array },
  methode: { type: Array },
  relationShip: { type: String },
  multiplicity: { type: String },
  metamodel_id:{type:String},
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const Table = mongoose.model("Table", TableSchema);
module.exports = Table;
