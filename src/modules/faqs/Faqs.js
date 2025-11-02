const mongoose = require("mongoose");

const FaqsSchema = new mongoose.Schema(
  {
    quiz_uz: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    quiz_ru: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    quiz_en: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    answer_uz: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    answer_ru: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    answer_en: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Faqs = mongoose.model("Faqs", FaqsSchema);

module.exports = Faqs;
