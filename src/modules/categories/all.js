const Categories = require("./Categories");

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

    // If parentId is provided, return only subcategories of that parent
    const filter = {};
    if (typeof query.parentId !== "undefined" && query.parentId !== "all") {
      filter.parentId = query.parentId;
    }

    // support tree view: return parents with nested children
    if (query && String(query.tree) === "true") {
      const allCats = await Categories.find().lean().exec();
      const byId = new Map();
      allCats.forEach((c) => byId.set(String(c._id), { ...c, children: [] }));
      const roots = [];
      for (const c of allCats) {
        if (c.parentId) {
          const parent = byId.get(String(c.parentId));
          if (parent) parent.children.push(byId.get(String(c._id)));
          else roots.push(byId.get(String(c._id)));
        } else {
          roots.push(byId.get(String(c._id)));
        }
      }
      return {
        categories: roots,
        total: roots.length,
        offset: 0,
        limit: roots.length,
      };
    }

    const categories = await Categories.find(filter)
      .sort(sortOptions)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .lean()
      .exec();

    const totalCategories = await Categories.countDocuments();

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
