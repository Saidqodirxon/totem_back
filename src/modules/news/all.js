const News = require("./News");

const allNewsService = async (query) => {
  try {
    const { q, page, limit, sort, is_visible } = query || {};

    const sortOptions = {};
    const paginationOptions = {};
    const filterOptions = {}; // Add filter options for query conditions

    const itemsPerPage = parseInt(limit) || 10;
    const currentPage = parseInt(page?.offset) || 1;
    const offset = parseInt(page?.offset) || 0;
    const requestedLimit = parseInt(page?.limit) || itemsPerPage;

    paginationOptions.skip = offset;
    paginationOptions.limit = requestedLimit;

    // Sorting logic
    if (sort && sort.by) {
      if (sort.by === "name_uz" || sort.by === "_id") {
        sortOptions[sort.by] = sort.order === "desc" ? -1 : 1;
      }
    }

    // Filter by is_visible if provided
    if (is_visible !== undefined) {
      filterOptions.is_visible = is_visible;
    }

    // Optional: Add search query filter if q is provided
    if (q) {
      filterOptions.name_uz = { $regex: q, $options: "i" }; // Example: case-insensitive search
    }

    const banners = await News.find(filterOptions)
      .sort(sortOptions)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .lean()
      .exec();

    const totalNews = await News.countDocuments(filterOptions);

    return {
      banners,
      total: totalNews,
      offset: paginationOptions.skip,
      limit: paginationOptions.limit,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = allNewsService;
