const { List, validate } = require("../models/list");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const winston = require("winston");

router.get("/", async (req, res) => {
  const lists = await List.find();
  //winston.info(lists);
  res.send(lists);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const list = new List({
    title: req.body.title
  });
  await list.save();
  res.send(list);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const list = await List.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title
    },
    { new: true }
  );

  if (!list)
    return res.status(404).send("The list with the given ID was not found.");

  res.send(list);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const list = await List.findByIdAndRemove(req.params.id);
  //winston.info(req.params.id);
  if (!list)
    return res.status(404).send("The list with the given ID was not found.");

  res.send(list);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const list = await List.findById(req.params.id).select("-__v");

  if (!list)
    return res.status(404).send("The list with the given ID was not found.");

  res.send(list);
});

module.exports = router;
