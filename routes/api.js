const express = require("express");
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const MetaModel = require("../models/MetaModel");
const router = express.Router();
const mongoose = require("mongoose");
const Entity = require("../models/Entity");

const createUser = async (formInfo) => {
  const user = new User(formInfo);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save();
  const obj = {
    userid: user._id,
    username: user.username,
  };
  return obj;
};
router.post("/user/create", async (req, res, next) => {
  var object = {};
  const formInfo = req.body.formInfo;

  const user = await User.findOne({
    $or: [{ email: formInfo.email }, { username: formInfo.username }],
  });
  if (user != null) {
    res.send({ userID: user._id, alreadyExists: true });
  } else {
    const obj = await createUser(formInfo);
    const returnedTarget = Object.assign(obj, object);
    res.send({
      userID: returnedTarget.userid,
      username: returnedTarget.username,
      alreadyExists: false,
    });
  }
});
router.post("/user/login", async (req, res, next) => {
  const formInfo = req.body.formInfo;
  const user = await User.findOne({ username: formInfo.username });

  if (user != null) {
    try {
      if (await bcrypt.compare(formInfo.password, user.password)) {
        res.send({ userID: user._id, username: user.username, isAuth: true });
      } else {
        res.send({ isAuth: false });
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    res.send({ isAuth: false });
  }
});

router.post("/metamodel-create", async (req, res, next) => {
  const data = req.body.data;
  let metaModel = new MetaModel();
  metaModel._id = new mongoose.Types.ObjectId();
  metaModel._type = data.diagramType;
  metaModel.name = data.modelName;
  metaModel.approachUsed = data.UsedApproach;
  metaModel.heuristic = data.targetQuality;
  metaModel.user_id = data.user_id;
  metaModel.save();
  res.send({ isCreate: true, MetaModel_ID: metaModel._id });
});
router.post("/entity-create", async (req, res, next) => {
  const data = req.body;
  console.log(data);
  let entity = new Entity();
  entity._id = new mongoose.Types.ObjectId();
  entity.name = data.name;
  entity.cardinalty = data.cardinality;
  entity.attribute = data.attributeData;
  entity.save();
  res.send({ isCreate: true, entity_ID: entity._id });
});

module.exports = router;
