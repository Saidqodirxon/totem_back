const { NotFoundError } = require("../../shared/errors");
const Categories = require("./Subcategories");

const removeCategoriesService = async ({ id }) => {
  const existing = await Categories.findById(id);

  if (!existing) {
    throw new NotFoundError("Categories Not Found.");
  }

  let delProd = await Categories.findByIdAndDelete(id);

  return delProd;
};

module.exports = removeCategoriesService;
