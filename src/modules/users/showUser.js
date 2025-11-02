const { NotFoundError } = require("../../shared/errors");
const User = require("./User");

const showUser = async ({ id }) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User Not Found.");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = showUser;
