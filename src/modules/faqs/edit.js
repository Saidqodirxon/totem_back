const { NotFoundError } = require("../../shared/errors");
const Faqs = require("./Faqs");

const editFaqsService = async ({ id, ...changes }) => {
  console.log(changes.changes);
  try {
    const updatedFaqs = await Faqs.findByIdAndUpdate(
      id,
      changes.changes,
      {
        new: true,
      }
    );

    if (!updatedFaqs) {
      throw new NotFoundError("faqs Not Found.");
    }

    return updatedFaqs;
  } catch (error) {
    throw error;
  }
};

module.exports = editFaqsService;
