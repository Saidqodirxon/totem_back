const { NotFoundError } = require("../../shared/errors");
const News = require("./News");

const removeNewsService = async ({ id }) => {
  const existing = await News.findById(id);

  if (!existing) {
    throw new NotFoundError("News Not Found.");
  }

  let delProd = await News.findByIdAndDelete(id);

  return delProd;
};

module.exports = removeNewsService;
