const express = require("express");
const httpValidator = require("../../shared/http-validator");
const {
  addFaqsSchema,
  patchFaqsSchema,
  allFaqsSchema,
} = require("./_schemas");
const addFaqsService = require("./add");
const editFaqsService = require("./edit");
const showFaqsService = require("./show");
const removeFaqsService = require("./remove");
const allFaqsService = require("./all");
const { UnauthorizedError } = require("../../shared/errors");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const addFaqs = async (req, res, next) => {
  try {
    console.log(req.file, "file");

    httpValidator({ body: req.body }, addFaqsSchema);

    const result = await addFaqsService(req);

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

const patchFaqs = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, patchFaqsSchema);
    if (req?.file) {
      let SITE_URL = process.env.SITE_URL;
      let image = `${SITE_URL}/${req.file.filename}`;
      console.log(`${SITE_URL}/${req.file.filename}`);
      // Only pass the necessary data from req.body
      req.body.image = image;
    }
    const result = await editFaqsService({
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
const showFaqs = async (req, res, next) => {
  try {
    const result = await showFaqsService({ id: req.params.id });

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

const getFaqs = async (req, res, next) => {
  try {
    httpValidator({ query: req.query }, allFaqsSchema);

    const { query } = req;
    const offset =
      query && query.page && query.page.offset
        ? parseInt(query.page.offset)
        : undefined;
    const limit =
      query && query.page && query.page.limit
        ? parseInt(query.page.limit)
        : undefined;

    const result = await allFaqsService({
      q: query.q,
      sort: query.sort,
      page: { limit, offset },
    });

    res.status(200).json({
      data: result.faqs,
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
const deleteFaqs = async (req, res, next) => {
  try {
    const result = await removeFaqsService({ id: req.params.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFaqs,
  patchFaqs,
  showFaqs,
  deleteFaqs,
  getFaqs,
};
