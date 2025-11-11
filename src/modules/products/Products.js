const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    name_uz: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    name_ru: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    name_en: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    description_uz: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    description_ru: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    description_en: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    about_uz: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    about_ru: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    about_en: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    is_visible: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "categories",
    },
    actionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "actions",
    },
    price: {
      type: mongoose.SchemaTypes.String,
    },
    variants: {
      type: mongoose.SchemaTypes.Array,
      required: true,
      items: {
        color_uz: { type: mongoose.SchemaTypes.String },
        color_ru: { type: mongoose.SchemaTypes.String },
        color_en: { type: mongoose.SchemaTypes.String },
        size: { type: mongoose.SchemaTypes.String },
        total: { type: mongoose.SchemaTypes.Number },
      },
    },
    min_buy_quantity: {
      type: mongoose.SchemaTypes.Number,
      default: 1,
    },
    max_buy_quantity: {
      type: mongoose.SchemaTypes.Number,
      default: 100,
    },
    original_price: {
      type: mongoose.SchemaTypes.String,
    },
    image: {
      type: mongoose.SchemaTypes.Array,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const products = mongoose.model("products", ProductsSchema);

module.exports = products;
