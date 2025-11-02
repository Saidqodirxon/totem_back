const { NotFoundError } = require("../../shared/errors");
const News = require("./News");

const editNewsService = async ({ id, ...changes }) => {
  console.log(changes.changes);
  try {
    const updatedNews = await News.findByIdAndUpdate(
      id,
      changes.changes,
      {
        new: true,
      }
    );

    if (!updatedNews) {
      throw new NotFoundError("News Not Found.");
    }

    return updatedNews;
  } catch (error) {
    throw error;
  }
};

module.exports = editNewsService;
