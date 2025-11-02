const Faqs = require("./Faqs");

const allFaqsService = async (query) => {
  try {
    const { q, page, limit, sort } = query || {};

    const sortOptions = {};
    const paginationOptions = {};

    const itemsPerPage = parseInt(limit) || 10000;
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

    const faqs = await Faqs.find()
      .sort(sortOptions)
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .lean()
      .exec();

    const totalFaqs = await Faqs.countDocuments();

    return {
      faqs: faqs,
      total: totalFaqs,
      offset: paginationOptions.skip,
      limit: paginationOptions.limit,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = allFaqsService;
