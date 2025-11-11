const Categories = require("./Subcategories");

const allCategoriesService = async (query) => {
  try {
    const { q, page, limit, sort } = query || {};

    const sortOptions = {};
    const paginationOptions = {};

    const itemsPerPage = parseInt(limit) || 1000;
    const currentPage = parseInt(page) || 1;
    const offset = parseInt(page.offset) || 0;
    const requestedLimit = parseInt(page.limit) || itemsPerPage;

    paginationOptions.skip = offset;
    paginationOptions.limit = requestedLimit;

    if (sort && sort.by) {
      if (sort.by === "name_uz") {
        sortOptions[sort.by] = sort.order === "desc" ? -1 : 1;
      }
    }

    const filter = {};
    // Accept both parentId and categoryId as aliases for filtering subcategories
    const parentFilter = query.parentId || query.categoryId;
    if (typeof parentFilter !== "undefined" && parentFilter !== "all") {
      filter.parentId = parentFilter;
    }

    const categories = await Categories.find(filter)
      .sort(sortOptions)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .lean()
      .exec();

    const totalCategories = await Categories.countDocuments(filter);

    return {
      categories: categories,
      total: totalCategories,
      offset: paginationOptions.skip,
      limit: paginationOptions.limit,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = allCategoriesService;
