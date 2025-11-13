const mongoose = require("mongoose");

const ExchangeRateSchema = new mongoose.Schema(
  {
    usd_to_uzs: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      default: 12500,
    },
    // Only one document should exist; use a constant _id
    _id: {
      type: String,
      default: "exchange_rate_usd",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ExchangeRate = mongoose.model("exchange_rates", ExchangeRateSchema);

module.exports = ExchangeRate;
