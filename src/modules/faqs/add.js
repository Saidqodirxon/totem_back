const Services = require("./Faqs");

let SITE_URL = process.env.SITE_URL;
const addFaqsService = async (req) => {
  try {
    const { quiz_uz, quiz_ru, quiz_en, answer_uz, answer_ru, answer_en } = req.body;

    const services = new Services({
      quiz_uz,
      quiz_ru,
      quiz_en,
      answer_uz,
      answer_ru,
      answer_en,
    });

    await services.save();
    console.log("Services saved successfully:", services); // Tekshirish uchun

    return services;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add services");
  }
};

module.exports = addFaqsService;
