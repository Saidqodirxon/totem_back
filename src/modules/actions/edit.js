const { NotFoundError } = require("../../shared/errors");
const Actions = require("./Actions");

const editActionsService = async ({ id, ...changes }) => {
  console.log(changes.changes);
  try {
    const updatedActions = await Actions.findByIdAndUpdate(
      id,
      changes.changes,
      {
        new: true,
      }
    );

    if (!updatedActions) {
      throw new NotFoundError("actions Not Found.");
    }

    return updatedActions;
  } catch (error) {
    throw error;
  }
};

module.exports = editActionsService;
