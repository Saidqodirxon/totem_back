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

    // Optional: Validate subcategory if provided (commented out for now)
    // if (subcategoryId) {
    //   try {
    //     const subcat = await Categories.findById(subcategoryId).lean();
    //     if (!subcat) {
    //       console.warn(`Subcategory with id ${subcategoryId} not found, skipping validation`);
    //     } else if (categoryId && subcat.parentId && String(subcat.parentId) !== String(categoryId)) {
    //       throw new Error("Subcategory does not belong to the provided category");
    //     }
    //   } catch (validationError) {
    //     console.error(`Subcategory validation error:`, validationError.message);
    //     if (validationError.message.includes("does not belong")) {
    //       throw validationError;
    //     }
    //   }
    // }

    const validVariants = Array.isArray(variants)
      ? variants.map((v) => ({
          color_uz: v.color_uz || "",
          color_ru: v.color_ru || "",
          color_en: v.color_en || "",
          size_uz: v.size_uz || "",
          size_ru: v.size_ru || "",
          size_en: v.size_en || "",
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
