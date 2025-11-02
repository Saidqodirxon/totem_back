const { NotFoundError } = require("../../shared/errors");
const Products = require("./Products");

const showProductsService = async ({ id }) => {
  try {
    const products = await Products.findById(id);

    if (!products) {
      throw new NotFoundError("Products not found.");
    }

    return products;
  } catch (error) {
    throw error;
  }
};

module.exports = showProductsService;
