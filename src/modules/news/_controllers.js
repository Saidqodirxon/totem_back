const express = require("express");
const httpValidator = require("../../shared/http-validator");
const {
  addNewsSchema,
  patchNewsSchema,
  allNewsSchema,
} = require("./_schemas");
const addNewsService = require("./add");
const editNewsService = require("./edit");
const showNewsService = require("./show");
const removeNewsService = require("./remove");
const allNewsService = require("./all");
const { UnauthorizedError } = require("../../shared/errors");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const addNews = async (req, res, next) => {
  try {
    console.log(req.file, "file");

    httpValidator({ body: req.body }, addNewsSchema);

    const result = await addNewsService(req);

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

const patchNews = async (req, res, next) => {
  try {
    httpValidator({ body: req.body }, patchNewsSchema);
    if (req?.file) {
      let SITE_URL = process.env.SITE_URL;
      let image = `${SITE_URL}/${req.file.filename}`;
      console.log(`${SITE_URL}/${req.file.filename}`);
      // Only pass the necessary data from req.body
      req.body.image = image;
    }
    const result = await editNewsService({
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
const showNews = async (req, res, next) => {
  try {
    const result = await showNewsService({ id: req.params.id });

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

const getNews = async (req, res, next) => {
  try {
    // Validate query parameters
    httpValidator({ query: req.query }, allNewsSchema);

    const { query } = req;
    const offset =
      query && query.page && query.page.offset
        ? parseInt(query.page.offset)
        : undefined;
    const limit =
      query && query.page && query.page.limit
        ? parseInt(query.page.limit)
        : undefined;

    const result = await allNewsService({
      q: query.q,
      sort: query.sort,
      page: { limit, offset },
      is_visible: query.is_visible, // Pass is_visible to the service
    });

    res.status(200).json({
      data: result.banners,
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
const deleteNews = async (req, res, next) => {
  try {
    const result = await removeNewsService({ id: req.params.id });

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNews,
  patchNews,
  showNews,
  deleteNews,
  getNews,
};
