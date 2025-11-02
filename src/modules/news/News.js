const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
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
    image: {
      type: mongoose.SchemaTypes.Array,
    },
    views: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const News = mongoose.model("News", NewsSchema);

module.exports = News;
