const express = require("express");
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const MetaModel = require("../models/MetaModel");
const router = express.Router();
const mongoose = require("mongoose");
const Entity = require("../models/Entity");
const Table = require("../models/Table");
const Association = require("../models/Association");
const RelationShip = require("../models/RelationShip");



//section of user 
const createUser = async (formInfo) => {
  const user = new User();
  user._id = new mongoose.Types.ObjectId();
  user.fullname = formInfo.fullname;
  user.username = formInfo.username;
  user.email = formInfo.email;
  user.password = formInfo.password;
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
  let formInfo = req.body.formInfo;

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
  let formInfo = req.body.formInfo;
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




//section of Meta-Model
router.post("/metamodel-update", async (req, res, next) => {
  const data = req.body;
  const query = { _id: data.metaModel_id };
  const addedWidgets = {
    description: data.descriptionModel,
    example: data.exampleModel,
  };
  const newValues = { $set: addedWidgets };
  try {
    const modelUpdated = await MetaModel.updateOne(query, [newValues]);
    res.status(201).send(modelUpdated);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
router.post("/metamodel-create", async (req, res, next) => {
  const data = req.body.data;
  let metaModel = new MetaModel();
  metaModel._id = new mongoose.Types.ObjectId();
  metaModel.type = data.diagramType;
  metaModel.name = data.modelName;
  metaModel.approachUsed = data.UsedApproach;
  metaModel.heuristic = data.targetQuality;
  metaModel.user_id = data.user_id;
  metaModel.save();
  res.send({ isCreate: true, MetaModel_ID: metaModel._id });
});
router.post("/get-table-data", async (req, res, next) => {
  console.log(req.body)
  Table.find({ metamodel_id: req.body.id}).then((Table) => {
    res.send(Table);
  });
});
router.post("/get-entity-data", async (req, res, next) => {
  console.log(req.body)
  Entity.find({ metamodel_id: req.body.id}).then((Entity) => {
    res.send(Entity);
  });
})
router.get("/get-all-models", async (req, res, next) => {
  MetaModel.find().then((models) => {
    res.send(models);
  });
})
router.post("/get-selected-target-model", async (req, res, next) => {
  console.log(req.body)
 const entities = await Entity.find({ metamodel_id : req.body._id_target})
 const association = await Association.find({ metamodel_id : req.body._id_target})
res.send({
  entitiesTarget : entities,
  associationTarget : association,
})

})
router.post("/get-selected-source-model", async (req, res, next) => {
  console.log(req.body)
 const tables = await Table.find({ metamodel_id : req.body._id_source})
 const relationships = await RelationShip.find({ metamodel_id : req.body._id_source})
res.send({
  tablesSource : tables,
  relationshipSource : relationships,
})

})
router.post("/get-edited-models", async (req, res, next) => {
  console.log(req.body)
 const editmodel = await MetaModel.find({ _id : req.body.notificationEdit})
 const editUser = await User.find({_id : editmodel[0].user_id})
res.send({
  EditedModel : editmodel,
  EditedUser : editUser
})

})









//section for table and entities 
router.post("/entity-create", async (req, res, next) => {
  const data = req.body;
  console.log(data);
  let entity = new Entity();
  entity._id = new mongoose.Types.ObjectId();
  entity.name = data.name;
  entity.cardinalty = data.cardinality;
  entity.attribute = data.attributeData;
  entity.metamodel_id = data.metaModel_ID;
  entity.save();
  res.send({ isCreate: true, entity_ID: entity._id });
});
router.post("/table-create", async (req, res, next) => {
  const data = req.body;
  console.log(data);
  let table = new Table();
  table._id = new mongoose.Types.ObjectId();
  table.name = data.name;
  table.attribute = data.attributes;
  table.methode = data.methodes;
  table.metamodel_id = data.metaModel_ID;
  table.multiplicity = data.cardinality;
  table.save();
  res.send({ isCreate: true, tbale_id: table._id });
});







//section  for relation and association

router.post("/association-create", async (req, res, next) => {
  const data = req.body;
  console.log(data);
  let association = new Association()

  association._id = new mongoose.Types.ObjectId();
  association.name = data.values.AssociationName;
  association.To = data.values.AssociationTo;
  association.From = data.values.AssociationFrom;
  association.metamodel_id = data.metaModel_ID;
  association.save();
  res.send({ isCreate: true});
});

router.post("/relationship-create", async (req, res, next) => {
  const data = req.body;
  console.log(data);
  let relationship = new RelationShip()

  relationship._id = new mongoose.Types.ObjectId();
  relationship.name = data.values.RelationShipName;
  relationship.To = data.values.RelationShipTo;
  relationship.From = data.values.RelationShipFrom;
  relationship.cardinalty  = data.values.RelationShipCardinalty;
  relationship.metamodel_id = data.metaModel_ID;
  relationship.type = data.values.RelationShipType;
  relationship.save();
  res.send({ isCreate: true});
});
router.post("/get-from-to-relations", async (req, res, next) => {
  const data = req.body;
  console.log(data);
  const Coding = await RelationShip.find({  metamodel_id : data.codedsourceModel_id})
  const CodingClasses = await Table.find({  metamodel_id : data.codedsourceModel_id})
  res.send({ Coding ,CodingClasses});
});

module.exports = router;
