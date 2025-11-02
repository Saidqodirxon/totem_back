const express = require("express");
require("dotenv/config");
const User = require("../../modules/users/User");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const isAdmin = async (req, res, next) => {
  try {

    const id = req.user.id;

    const user = await User.findById(id);

    const userCredentials = user.role;

    if (userCredentials != "admin") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateKey = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `The ${duplicateKey} '${error.keyValue[duplicateKey]}' already exists.`,
      });
    }

    res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
  }
};

module.exports = isAdmin;
