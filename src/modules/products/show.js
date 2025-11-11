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

    // if this product is a set, fetch the items inside the set and attach them
    let result = products.toObject ? products.toObject() : products;
    if (result.is_set && Array.isArray(result.set) && result.set.length > 0) {
      const setItems = await Products.find({ _id: { $in: result.set } }).lean();
      result.setProducts = setItems;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = showProductsService;
