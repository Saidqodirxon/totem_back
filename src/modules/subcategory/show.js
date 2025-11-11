const { NotFoundError } = require("../../shared/errors");
const Categories = require("./Categories");

const showCategoriesService = async ({ id }) => {
  try {
    const categories = await Categories.findById(id);

    if (!categories) {
      throw new NotFoundError("categories not found.");
    }

    return categories;
  } catch (error) {
    throw error;
  }
};

module.exports = showCategoriesService;
