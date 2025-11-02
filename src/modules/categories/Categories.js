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
    image: {
      type: {
        url: {
          type: mongoose.SchemaTypes.String,
          required: true,
        },
        id: {
          type: mongoose.SchemaTypes.String,
          required: true,
        },
      },
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Categories = mongoose.model("Categories", CategoriesSchema);

module.exports = Categories;
