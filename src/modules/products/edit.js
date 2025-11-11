const { NotFoundError } = require("../../shared/errors");
const Products = require("./Products");
const Subcategories = require("../subcategory/Subcategories");

const editProductsService = async ({ id, ...changes }) => {
  console.log(changes.changes);
  try {
    // validate subcategory/category relationship if present in changes
    const incoming = changes.changes || {};
    if (incoming.subcategoryId) {
      const subcat = await Subcategories.findById(incoming.subcategoryId).lean();
      if (!subcat) throw new NotFoundError("Subcategory not found.");
      const newCategoryId = incoming.categoryId || undefined;
      if (newCategoryId && subcat.parentId && String(subcat.parentId) !== String(newCategoryId)) {
        throw new Error("Subcategory does not belong to the provided category");
      }
    }

    const updatedProducts = await Products.findByIdAndUpdate(
      id,
      incoming,
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
