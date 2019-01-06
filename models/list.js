const Joi = require("joi");
const mongoose = require("mongoose");

const List = mongoose.model(
  "Lists",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255
    }
  })
);

function validateList(list) {
  const schema = {
    title: Joi.string()
      .min(1)
      .max(50)
      .required()
  };

  return Joi.validate(list, schema);
}

exports.List = List;
exports.validate = validateList;
