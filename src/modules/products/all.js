const mongoose = require("mongoose");
const Products = require("./Products");
const ExchangeRate = require("../exchange-rate/ExchangeRate");

const allProductsService = async (query) => {
  try {
    const {
      q,
      page,
      limit,
      sort,
      is_visible,
      view,
      categoryId,
      subcategoryId,
      actionId,
      all,
    } = query || {};

    const sortOptions = {};
    const paginationOptions = {};
    // usd,

    const itemsPerPage = parseInt(limit) || 1000;
    const currentPage = parseInt(page?.currentPage) || 1;
    const offset = parseInt(page?.offset) || 0;
    const requestedLimit = parseInt(page?.limit) || itemsPerPage;

    if (!all) {
      paginationOptions.skip = offset;
      paginationOptions.limit = requestedLimit;
    }

    if (sort && sort.by) {
      if (sort.by === "name_ru") {
        sortOptions[sort.by] = sort.order === "desc" ? -1 : 1;
      } else if (sort.by === "name_uz") {
        sortOptions[sort.by] = sort.order === "desc" ? -1 : 1;
      } else if (sort.by === "name_en") {
        sortOptions[sort.by] = sort.order === "desc" ? -1 : 1;
      }
    }

    // 🔽 Query filter
    const filter = {};

    // If search query `q` exists, apply it to the fields you want to search
    if (q) {
      const regex = new RegExp(q, "i"); // "i" for case-insensitive search
      filter.$or = [
        { name_uz: { $regex: regex } },
        { description_uz: { $regex: regex } },
      ];
    }

    if (typeof is_visible !== "undefined" && is_visible !== "all") {
      filter.is_visible = is_visible === "true";
    }

    if (typeof view !== "undefined" && view !== "all") {
      // schema stores views as `views` (number). Accept query param `view` and map to `views`.
      filter.views = parseInt(view);
    }

    if (typeof categoryId !== "undefined" && categoryId !== "all") {
      filter.categoryId = categoryId;
    }
    if (typeof subcategoryId !== "undefined" && subcategoryId !== "all") {
      filter.subcategoryId = subcategoryId;
    }

    if (typeof actionId !== "undefined" && actionId !== "all") {
      // Accept multiple input shapes: array, CSV string, JSON array string, or single id
      let values = [];
      try {
        if (Array.isArray(actionId)) {
          values = actionId;
        } else if (typeof actionId === "string") {
          const raw = actionId.trim();
          if (!raw) values = [];
          else if (raw.startsWith("[") || raw.startsWith("{")) {
            // try parse JSON
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) values = parsed;
            else values = [parsed];
          } else if (raw.includes(",")) {
            values = raw
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          } else {
            values = [raw];
          }
        } else {
          values = [actionId];
        }
      } catch (err) {
        // fallback to single value
        values = [actionId];
      }

      // normalize values and cast valid ObjectId strings to ObjectId
      const normalized = values
        .map((v) => (v === null || v === undefined ? "" : String(v).trim()))
        .filter(Boolean);

      if (normalized.length === 1) {
        const v = normalized[0];
        filter.actionId = mongoose.isValidObjectId(v)
          ? new mongoose.Types.ObjectId(v)
          : v;
      } else if (normalized.length > 1) {
        filter.actionId = {
          $in: normalized.map((v) =>
            mongoose.isValidObjectId(v) ? new mongoose.Types.ObjectId(v) : v
          ),
        };
      }
    }

    let queryBuilder = Products.find(filter).sort(sortOptions).lean();

    if (!all) {
      queryBuilder = queryBuilder
        .skip(paginationOptions.skip)
        .limit(paginationOptions.limit);
    }

    const products = await queryBuilder.exec();
    const totalProducts = await Products.countDocuments(filter);

    // Get USD to UZS exchange rate
    let exchangeRate = await ExchangeRate.findById("exchange_rate_usd").lean();
    if (!exchangeRate) {
      exchangeRate = { usd_to_uzs: 12500 }; // default
    }

    // Convert USD prices to UZS
    const productsWithUzs = products.map((product) => {
      const priceUsd = parseFloat(product.price) || 0;
      const priceUzs = Math.round(priceUsd * exchangeRate.usd_to_uzs);
      const originalPriceUsd = parseFloat(product.original_price) || 0;
      const originalPriceUzs = Math.round(
        originalPriceUsd * exchangeRate.usd_to_uzs
      );
      return {
        ...product,
        price_usd: product.price,
        price: priceUzs.toString(),
        original_price_usd: product.original_price,
        original_price: originalPriceUzs.toString(),
      };
    });

    return {
      products: productsWithUzs,
      total: totalProducts,
      offset: all ? 0 : paginationOptions.skip,
      limit: all ? totalProducts : paginationOptions.limit,
      exchange_rate: exchangeRate.usd_to_uzs,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = allProductsService;
