const { NotFoundError } = require("../../shared/errors");
const Actions = require("./Actions");

const showActionsService = async ({ id }) => {
  try {
    const actions = await Actions.findById(id);

    if (!actions) {
      throw new NotFoundError("actions not found.");
    }

    return actions;
  } catch (error) {
    throw error;
  }
};

module.exports = showActionsService;
