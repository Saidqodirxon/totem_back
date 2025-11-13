const ExchangeRate = require("./ExchangeRate");

const updateExchangeRateService = async (usd_to_uzs) => {
  const updated = await ExchangeRate.findByIdAndUpdate(
    "exchange_rate_usd",
    {
      usd_to_uzs,
      updatedAt: new Date(),
    },
    {
      new: true,
      upsert: true, // Agar yo'q bo'lsa, yangi yaratadi
    }
  );

  return updated;
};

module.exports = updateExchangeRateService;
