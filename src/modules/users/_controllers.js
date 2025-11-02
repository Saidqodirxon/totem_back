const express = require("express");
const httpValidator = require("../../shared/http-validator");
let { postLoginUserSchema, patchMeSchema } = require("./_schemas");
const loginUser = require("./loginUser");
const editUserS = require("./editUser");
const showUser = require("./showUser");
const { UnauthorizedError, BadRequestError } = require("../../shared/errors");

const postLoginUser = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, postLoginUserSchema);

    const result = await loginUser(req.body);

    res.status(200).json({
      data: {
        token: result.token,
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(403).json({
        message: "Incorrect username or password",
      });
    }
    next(error);
  }
};

const editUserMe = async (req, res, next) => {
  const { error } = patchMeSchema.body.validate(req.body);

  if (error) {
    const details = error.details.map((err) => err.message).join(", ");
    return next(new BadRequestError(`Validation error: ${details}`));
  }

  try {
    const result = await editUserS({
      id: req.user.id,
      req,
      ...req.body,
    });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const result = await showUser({ id: req.user.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const Main = async (req, res, next) => {
  try {
    res.status(200).json({
      run: "Ha ishlayabti havotir bo'lmang",
    });
  } catch (error) {
    next(error);
  }
};

const Dev = async (req, res, next) => {
  try {
    res.status(200).json({
      coder: "ALCODERS.UZ IT Group tomonidan ishlab chiqilgan",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postLoginUser,
  editUserMe,
  getMe,
  Main,
  Dev,
};
