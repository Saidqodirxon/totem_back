const Joi = require("joi");

exports.addFaqsSchema = {
  body: Joi.object({
    quiz_uz: Joi.string(),
    quiz_ru: Joi.string(),
    quiz_en: Joi.string(),
    answer_uz: Joi.string(),
    answer_ru: Joi.string(),
    answer_en: Joi.string(),
  }),
};

exports.patchFaqsSchema = {
  params: Joi.object({
    id: Joi.string(),
  }),
  body: Joi.object({
    _id: Joi.string(),
    quiz_uz: Joi.string(),
    quiz_ru: Joi.string(),
    quiz_en: Joi.string(),
    answer_uz: Joi.string(),
    answer_ru: Joi.string(),
    answer_en: Joi.string(),
  }),
};

exports.allFaqsSchema = {
  query: Joi.object({
    q: Joi.string(),
    sort: Joi.object({
      by: Joi.string().valid("_id"),
      order: Joi.string().valid("asc", "desc"),
    }),
    page: Joi.object({
      offset: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(1).default(3),
    }),
  }),
};
