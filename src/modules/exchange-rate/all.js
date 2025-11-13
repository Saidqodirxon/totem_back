const ExchangeRate = require("./ExchangeRate");

const getExchangeRateService = async () => {
  const rate = await ExchangeRate.findById("exchange_rate_usd").lean();

  if (!rate) {
    // Birinchi marta bo'lsa yangi dokument yaratamiz
    const newRate = await ExchangeRate.create({
      _id: "exchange_rate_usd",
      usd_to_uzs: 12500,
    });
    return newRate;
  }

  return rate;
};

module.exports = getExchangeRateService;
