const Services = require("./Actions");

let SITE_URL = process.env.SITE_URL;
const addActionsService = async (req) => {
  try {
    const { name_uz, name_ru, name_en, image } = req.body;

    const services = new Services({
      name_uz,
      name_ru,
      name_en,
    });

    await services.save();
    console.log("Services saved successfully:", services); // Tekshirish uchun

    return services;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add services");
  }
};

module.exports = addActionsService;
