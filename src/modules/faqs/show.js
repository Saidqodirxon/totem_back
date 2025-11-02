const { NotFoundError } = require("../../shared/errors");
const Faqs = require("./Faqs");

const showFaqsService = async ({ id }) => {
  try {
    const faqs = await Faqs.findById(id);

    if (!faqs) {
      throw new NotFoundError("faqs not found.");
    }

    return faqs;
  } catch (error) {
    throw error;
  }
};

module.exports = showFaqsService;
