const Services = require("./Categories");

let SITE_URL = process.env.SITE_URL;
const addCategoriesService = async (req) => {
  try {
    const { name_uz, name_ru, name_en, parentId } = req.body;

    const services = new Services({
      name_uz,
      name_ru,
      name_en,
      parentId: parentId || null,
    });

    await services.save();
    console.log("Services saved successfully:", services); // Tekshirish uchun

    return services;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add services");
  }
};

module.exports = addCategoriesService;
