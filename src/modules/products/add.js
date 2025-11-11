const Products = require("./Products");
const Categories = require("../categories/Categories");

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
      subcategoryId,
      actionId,
      price,
      original_price,
      variants,
      is_visible,
      min_buy_quantity,
      max_buy_quantity,
      is_set,
      set,
    } = req.body;

    if (subcategoryId) {
      const subcat = await Categories.findById(subcategoryId).lean();
      if (!subcat) {
        throw new Error("Subcategory not found");
      }
      if (categoryId && subcat.parentId && String(subcat.parentId) !== String(categoryId)) {
        throw new Error("Subcategory does not belong to the provided category");
      }
    }

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
      subcategoryId,
      actionId,
      price,
      original_price,
      variants: validVariants,
      is_visible,
      min_buy_quantity,
      max_buy_quantity,
      is_set: !!is_set,
      set: Array.isArray(set) ? set : [],
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
