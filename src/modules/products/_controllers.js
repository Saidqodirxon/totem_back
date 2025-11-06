const express = require("express");
const httpValidator = require("../../shared/http-validator");
const {
  addProductsSchema,
  patchProductsSchema,
  allProductsSchema,
} = require("./_schemas");
const addProductsService = require("./add");
const editProductsService = require("./edit");
const showProductsService = require("./show");
const removeProductsService = require("./remove");
const allProductsService = require("./all");
const { UnauthorizedError } = require("../../shared/errors");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const addProducts = async (req, res, next) => {
  try {
    console.log(req.file, "file");

    httpValidator({ body: req.body }, addProductsSchema);

    const result = await addProductsService(req);

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

const patchProducts = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, patchProductsSchema);
    if (req?.file) {
      let SITE_URL = process.env.SITE_URL;
      let image = `${SITE_URL}/${req.file.filename}`;
      console.log(`${SITE_URL}/${req.file.filename}`);
      // Only pass the necessary data from req.body
      req.body.image = image;
    }
    const result = await editProductsService({
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
const showProducts = async (req, res, next) => {
  try {
    const result = await showProductsService({ id: req.params.id });

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

const getProducts = async (req, res, next) => {
  try {
    httpValidator({ query: req.query }, allProductsSchema);

    const { query } = req;
    const offset =
      query && query.page && query.page.offset
        ? parseInt(query.page.offset)
        : undefined;
    const limit =
      query && query.page && query.page.limit
        ? parseInt(query.page.limit)
        : undefined;

    const result = await allProductsService({
      q: query.q, // Pass search query
      sort: query.sort,
      page: { limit, offset },
      is_visible: query.is_visible,
      view: query.view,
      categoryId: query.categoryId, // Pass categoryId to service
      actionId: query.actionId,
    });

    res.status(200).json({
      data: result.products,
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
const deleteProducts = async (req, res, next) => {
  try {
    const result = await removeProductsService({ id: req.params.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProducts,
  patchProducts,
  showProducts,
  deleteProducts,
  getProducts,
};
