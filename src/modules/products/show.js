const { NotFoundError } = require("../../shared/errors");
const Products = require("./Products");

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

    return products;
  } catch (error) {
    throw error;
  }
};

module.exports = showProductsService;
