const express = require("express");
const httpValidator = require("../../shared/http-validator");
const {
  addCategoriesSchema,
  patchCategoriesSchema,
  allCategoriesSchema,
} = require("./_schemas");
const addCategoriesService = require("./add");
const editCategoriesService = require("./edit");
const showCategoriesService = require("./show");
const removeCategoriesService = require("./remove");
const allCategoriesService = require("./all");
const { UnauthorizedError } = require("../../shared/errors");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const addCategories = async (req, res, next) => {
  try {
    console.log(req.file, "file");

    httpValidator({ body: req.body }, addCategoriesSchema);

    const result = await addCategoriesService(req);

    console.log(result, "result");

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    console.log(error);
    next(error);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const patchCategories = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, patchCategoriesSchema);
    if (req?.file) {
      let SITE_URL = process.env.SITE_URL;
      let image = `${SITE_URL}/${req.file.filename}`;
      console.log(`${SITE_URL}/${req.file.filename}`);
      // Only pass the necessary data from req.body
      req.body.image = image;
    }
    const result = await editCategoriesService({
      id: req.params.id,
      changes: { ...req.body }, // Include image in the changes
    });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const showCategories = async (req, res, next) => {
  try {
    const result = await showCategoriesService({ id: req.params.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const getCategories = async (req, res, next) => {
  try {
    httpValidator({ query: req.query }, allCategoriesSchema);

    const { query } = req;
    const offset =
      query && query.page && query.page.offset
        ? parseInt(query.page.offset)
        : undefined;
    const limit =
      query && query.page && query.page.limit
        ? parseInt(query.page.limit)
        : undefined;

    const result = await allCategoriesService({
      q: query.q,
      sort: query.sort,
      page: { limit, offset },
      parentId: query.parentId,
      categoryId: query.categoryId,
    });

    res.status(200).json({
      data: result.categories,
      pageInfo: {
        total: result.total,
        offset: result.offset,
        limit: result.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const deleteCategories = async (req, res, next) => {
  try {
    const result = await removeCategoriesService({ id: req.params.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategories,
  patchCategories,
  showCategories,
  deleteCategories,
  getCategories,
};
