const { NotFoundError } = require("../../shared/errors");
const News = require("./News");

const showNewsService = async ({ id }) => {
  try {
    const banners = await News.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!banners) {
      throw new NotFoundError("News not found.");
    }

    return banners;
  } catch (error) {
    throw error;
  }
};

module.exports = showNewsService;
