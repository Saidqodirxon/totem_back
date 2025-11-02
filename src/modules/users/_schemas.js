const Joi = require("joi");

exports.postLoginUserSchema = {
  body: Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

exports.patchMeSchema = {
  body: Joi.object({
    login: Joi.string(),
    password: Joi.string(),
  }),
};
