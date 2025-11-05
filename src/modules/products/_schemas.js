const Joi = require("joi");

exports.addProductsSchema = {
  body: Joi.object({
    name_uz: Joi.string(),
    name_ru: Joi.string(),
    name_en: Joi.string(),
    description_uz: Joi.string(),
    description_ru: Joi.string(),
    description_en: Joi.string(),
    about_uz: Joi.string(),
    about_ru: Joi.string(),
    about_en: Joi.string(),
    categoryId: Joi.string(),
    actionId: Joi.string(),
    is_visible: Joi.boolean(),
    price: Joi.string(),
    original_price: Joi.string(),
    min_buy_quantity: Joi.number(),
    max_buy_quantity: Joi.number(),
    variants: Joi.array().items(Joi.object({
      color_uz: Joi.string(),
      color_ru: Joi.string(),
      color_en: Joi.string(),
      size: Joi.string(),
      total: Joi.number(),
    })),
    image: Joi.array(),
  }),
};

exports.patchProductsSchema = {
  params: Joi.object({
    id: Joi.string(),
  }),
  body: Joi.object({
    _id: Joi.string(),

    name_uz: Joi.string(),
    name_ru: Joi.string(),
    name_en: Joi.string(),
    description_uz: Joi.string(),
    description_ru: Joi.string(),
    description_en: Joi.string(),
    about_uz: Joi.string(),
    about_ru: Joi.string(),
    about_en: Joi.string(),
    categoryId: Joi.string(),
    actionId: Joi.string(),
    is_visible: Joi.boolean(),
    price: Joi.string(),
    original_price: Joi.string(),
    min_buy_quantity: Joi.number(),
    max_buy_quantity: Joi.number(),
    variants: Joi.array().items(Joi.object({
      color_uz: Joi.string(),
      color_ru: Joi.string(),
      color_en: Joi.string(),
      size: Joi.string(),
      total: Joi.number(),
    })),
    image: Joi.array(),
  }),
};

exports.allProductsSchema = {
  query: Joi.object({
    q: Joi.string(),
    is_visible: Joi.string().valid("true", "false"),
    categoryId: Joi.string().optional(), // .required() 
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
