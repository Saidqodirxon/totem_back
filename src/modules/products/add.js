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
      variants: { color_uz, color_ru, color_en, size, total },
      is_visible,
      min_buy_quantity,
      max_buy_quantity
    } = req.body;

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
      variants: { color_uz, color_ru, color_en, size, total },
      is_visible,
      min_buy_quantity,
      max_buy_quantity
    });

    await products.save();
    console.log("Products saved successfully:", products); // Tekshirish uchun

    return products;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add products");
  }
};

module.exports = addProductsService;
