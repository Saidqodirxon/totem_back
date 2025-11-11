const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
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
    parentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "categories",
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Categories = mongoose.model("categories", CategoriesSchema);

module.exports = Categories;
