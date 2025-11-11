const { NotFoundError } = require("../../shared/errors");
const Categories = require("./Subcategories");

const editCategoriesService = async ({ id, ...changes }) => {
  console.log(changes.changes);
  try {
    const updatedCategories = await Categories.findByIdAndUpdate(
      id,
      changes.changes,
      {
        new: true,
      }
    );

    if (!updatedCategories) {
      throw new NotFoundError("categories Not Found.");
    }

    return updatedCategories;
  } catch (error) {
    throw error;
  }
};

module.exports = editCategoriesService;
