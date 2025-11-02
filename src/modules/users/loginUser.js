const { compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../../shared/errors");
const config = require("../../shared/config");
const User = require("./User");

const loginUser = async ({ login, password }) => {
  const existing = await User.findOne({ login });

  if (!existing) {
    throw new UnauthorizedError("Incorrect login or password.");
  }

  const match = await compare(password, existing.password);

  if (!match) {
    throw new UnauthorizedError("Incorrect login or password.");
  }

  const token = jwt.sign(
    { user: { id: existing._id, role: existing.role } },
    config.jwt.secret
  );

  return { token: token, role: existing.role };
};

module.exports = loginUser;
