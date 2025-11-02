const { NotFoundError } = require("../../shared/errors");
const News = require("./News");

const showNewsService = async ({ id }) => {
  try {
    const banners = await News.findById(id);

    if (!banners) {
      throw new NotFoundError("News not found.");
    }

    return banners;
  } catch (error) {
    throw error;
  }
};

module.exports = showNewsService;
