const Joi = require("joi");

const getSchema = {};

const updateSchema = Joi.object({
  body: Joi.object({
    usd_to_uzs: Joi.number()
      .positive()
      .required()
      .messages({
        "number.positive": "USD to UZS rate must be a positive number",
        "any.required": "USD to UZS rate is required",
      }),
  }),
});

module.exports = {
  getSchema,
  updateSchema,
};
