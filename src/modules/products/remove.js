const { NotFoundError } = require("../../shared/errors");
const Products = require("./Products");

const removeProductsService = async ({ id }) => {
  const existing = await Products.findById(id);

  if (!existing) {
    throw new NotFoundError("Products Not Found.");
  }

  let delProd = await Products.findByIdAndDelete(id);

  return delProd;
};

module.exports = removeProductsService;
