const News = require("./News");

let SITE_URL = process.env.SITE_URL;
const addNewsService = async (req) => {
  try {
    const { name_uz, name_ru, name_en, description_uz, description_ru, description_en, image } = req.body;

    const banners = new News({
      name_uz,
      name_ru,
      name_en,
      description_uz,
      description_ru,
      description_en,
      image,
    });

    await banners.save();
    console.log("News saved successfully:", banners);

    return banners;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add news");
  }
};

module.exports = addNewsService;
