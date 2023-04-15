const mongoose = require("mongoose");
const uuid = require("node-uuid");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String, default: uuid.v4, required: true },
  fullname: { type: String, required: true},
  username: { type: String, required: true},
  email: { type: String, required: true},
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;