const { NotFoundError } = require("../../shared/errors");
const Actions = require("./Actions");

const removeActionsService = async ({ id }) => {
  const existing = await Actions.findById(id);

  if (!existing) {
    throw new NotFoundError("Actions Not Found.");
  }

  let delProd = await Actions.findByIdAndDelete(id);

  return delProd;
};

module.exports = removeActionsService;
