const { NotFoundError } = require("../../shared/errors");
const Products = require("./Products");

const editProductsService = async ({ id, ...changes }) => {
  console.log(changes.changes);
  try {
    const updatedProducts = await Products.findByIdAndUpdate(
      id,
      changes.changes,
      {
        new: true,
      }
    );

    if (!updatedProducts) {
      throw new NotFoundError("Products Not Found.");
    }

    return updatedProducts;
  } catch (error) {
    throw error;
  }
};

module.exports = editProductsService;
