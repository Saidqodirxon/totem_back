const { NotFoundError } = require("../../shared/errors");
const Products = require("./Products");
const ExchangeRate = require("../exchange-rate/ExchangeRate");

const showProductsService = async ({ id }) => {
  try {
    // increment views atomically and return updated document
    const products = await Products.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!products) {
      throw new NotFoundError("Products not found.");
    }

    // Get USD to UZS exchange rate
    let exchangeRate = await ExchangeRate.findById("exchange_rate_usd").lean();
    if (!exchangeRate) {
      exchangeRate = { usd_to_uzs: 12500 }; // default
    }

    // if this product is a set, fetch the items inside the set and attach them
    let result = products.toObject ? products.toObject() : products;

    // Convert USD price to UZS
    const priceUsd = parseFloat(result.price) || 0;
    const priceUzs = Math.round(priceUsd * exchangeRate.usd_to_uzs);
    const originalPriceUsd = parseFloat(result.original_price) || 0;
    const originalPriceUzs = Math.round(originalPriceUsd * exchangeRate.usd_to_uzs);
    result.price_usd = result.price;
    result.price = priceUzs.toString();
    result.original_price_usd = result.original_price;
    result.original_price = originalPriceUzs.toString();
    result.exchange_rate = exchangeRate.usd_to_uzs;

    if (result.is_set && Array.isArray(result.set) && result.set.length > 0) {
      const setItems = await Products.find({ _id: { $in: result.set } }).lean();
      // Convert set items prices to UZS
      result.setProducts = setItems.map((item) => {
        const itemPriceUsd = parseFloat(item.price) || 0;
        const itemPriceUzs = Math.round(itemPriceUsd * exchangeRate.usd_to_uzs);
        const itemOriginalPriceUsd = parseFloat(item.original_price) || 0;
        const itemOriginalPriceUzs = Math.round(itemOriginalPriceUsd * exchangeRate.usd_to_uzs);
        return {
          ...item,
          price_usd: item.price,
          price: itemPriceUzs.toString(),
          original_price_usd: item.original_price,
          original_price: itemOriginalPriceUzs.toString(),
        };
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = showProductsService;
