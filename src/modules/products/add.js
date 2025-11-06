const Products = require("./Products");

let SITE_URL = process.env.SITE_URL;

const addProductsService = async (req) => {
  try {
    const {
      name_uz,
      name_ru,
      name_en,
      description_uz,
      description_ru,
      description_en,
      about_uz,
      about_ru,
      about_en,
      image,
      categoryId,
      actionId,
      price,
      original_price,
      variants, // ✅ endi to‘liq array sifatida olamiz
      is_visible,
      min_buy_quantity,
      max_buy_quantity,
    } = req.body;

    // ✅ variants massivligini tekshiramiz
    const validVariants = Array.isArray(variants)
      ? variants.map((v) => ({
        color_uz: v.color_uz || "",
        color_ru: v.color_ru || "",
        color_en: v.color_en || "",
        size: v.size || "",
        total: Number(v.total) || 0,
      }))
      : [];

    const products = new Products({
      name_uz,
      name_ru,
      name_en,
      description_uz,
      description_ru,
      description_en,
      about_uz,
      about_ru,
      about_en,
      image,
      categoryId,
      actionId,
      price,
      original_price,
      variants: validVariants, // ✅ to‘g‘ri formatda saqlaymiz
      is_visible,
      min_buy_quantity,
      max_buy_quantity,
    });

    await products.save();

    console.log("Products saved successfully:", products);

    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add products");
  }
};

module.exports = addProductsService;
