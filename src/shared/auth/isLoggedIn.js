const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { UnauthorizedError } = require("../errors");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret, {
      ignoreExpiration: false,
    });
    console.log(decoded.user);
    req.user = decoded.user;

    next();
  } catch (error) {
    next(new UnauthorizedError("Unauthorized."));
  }
};

module.exports = isLoggedIn;
