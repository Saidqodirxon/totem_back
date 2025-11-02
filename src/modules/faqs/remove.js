const { NotFoundError } = require("../../shared/errors");
const Faqs = require("./Faqs");

const removeFaqsService = async ({ id }) => {
  const existing = await Faqs.findById(id);

  if (!existing) {
    throw new NotFoundError("Faqs Not Found.");
  }

  let delProd = await Faqs.findByIdAndDelete(id);

  return delProd;
};

module.exports = removeFaqsService;
