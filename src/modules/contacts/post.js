require("dotenv").config();
const Contacts = require("./Contacts");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
});

const siteUrl = process.env.MAIN_SITE;
const chatId = process.env.CHAT_ID;

console.log(chatId, " chatId");

// [1551855614 /* @Real_Coder */]; with array

const postContact = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required." });
    }

    // MongoDB ga saqlash
    const contact = new Contacts({
      name,
      phone,
    });
    const savedContact = await contact.save();

    // MongoDB dan yaratilgan vaqtni olish (Asia/Tashkent vaqt mintaqasi bilan)
    const dateOptions = { timeZone: "Asia/Tashkent" };
    const createdAt = new Date(savedContact.createdAt);
    const currentDate = createdAt.toLocaleDateString("en-US", dateOptions);
    const currentTime = createdAt.toLocaleTimeString("en-US", dateOptions);

    // Telegramga xabar yuborish
    const telegramMessage = `
      ${siteUrl} dan yangi xabar keldi: \n 
      <b>● Ismi: </b>${name} 
      <b>● Telefon Raqami: </b>${phone} 
      <b>● Yuborilgan Sana: </b>${currentDate}
      <b>● Yuborilgan Soati: </b>${currentTime}
    `;

    // for (const chatId of chatIds) {
    await bot.sendMessage(`-1002638687829`, telegramMessage, {
      parse_mode: "HTML",
    });
    // }

    res.status(200).json({
      message: "Contact saved and sent successfully.",
      data: savedContact,
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({
      error: "An error occurred while processing the request.",
    });
  }
};

module.exports = postContact;
