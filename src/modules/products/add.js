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
      price,
      original_price,
      color,
      size,
      total,
      is_visible
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
      price,
      original_price,
      color,
      size,
      total,
      is_visible
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
