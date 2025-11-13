const getExchangeRateService = require("./all");
const updateExchangeRateService = require("./update");
const { updateSchema } = require("./_schemas");
const validateRequest = require("../../shared/http-validator");

const getExchangeRate = async (req, res, next) => {
  try {
    const rate = await getExchangeRateService();
    res.json({
      data: rate,
    });
  } catch (error) {
    next(error);
  }
};

const updateExchangeRate = async (req, res, next) => {
  try {
    // Validate request
    await validateRequest(
      {
        body: req.body,
      },
      updateSchema
    );

    const { usd_to_uzs } = req.body;
    const updated = await updateExchangeRateService(usd_to_uzs);

    res.json({
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExchangeRate,
  updateExchangeRate,
};
