require("dotenv").config();
const Contacts = require("./Contacts");
const Products = require("../products/Products");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
});

const siteUrl = process.env.MAIN_SITE;
const chatId = process.env.CHAT_ID;

console.log(chatId, " chatId");

// simple HTML escape for Telegram HTML parse_mode
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// [1551855614 /* @Real_Coder */]; with array

const postContact = async (req, res) => {
  try {
    const { name, phone, products } = req.body;

    // Require name. Allow missing phone only if products are provided (treat as inquiry).
    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    if (!phone && (!products || (Array.isArray(products) && products.length === 0))) {
      // no phone AND no products -> not enough information
      return res.status(400).json({ error: "Provide phone or products alongside name." });
    }
    // MongoDB ga saqlash
    const contact = new Contacts({
      name,
      phone,
      products,
    });
    const savedContact = await contact.save();

    // MongoDB dan yaratilgan vaqtni olish (Asia/Tashkent vaqt mintaqasi bilan)
    const dateOptions = { timeZone: "Asia/Tashkent" };
    const createdAt = new Date(savedContact.createdAt);
    const currentDate = createdAt.toLocaleDateString("en-US", dateOptions);
    const currentTime = createdAt.toLocaleTimeString("en-US", dateOptions);

    // Telegramga xabar yuborish
    // products may be either an array of ids (strings) OR objects like
    // { id, qty, color, size } — normalize and group by id+color+size
    const rawProducts = Array.isArray(products) ? products : [];

    // counts keyed by composite key: id||color||size
    const grouped = {}; // key -> { id, color, size, qty }

    const idsSet = new Set();

    for (const item of rawProducts) {
      let id;
      let color = "";
      let size = "";
      let qty = 0;

      if (!item) continue;

      if (typeof item === "string" || typeof item === "number") {
        id = String(item);
        qty = 1;
      } else if (typeof item === "object") {
        id = String(item.id || item._id || item.productId || "");
        color = item.color ? String(item.color) : "";
        size = item.size ? String(item.size) : "";
        // allow qty provided by client under several common keys (qty, quantity, count)
        const rawQty = item.qty ?? item.quantity ?? item.count ?? item.quantity;
        qty = Number.isFinite(Number(rawQty)) ? parseInt(rawQty, 10) : 1;
      }

      if (!id) continue;
      idsSet.add(id);

      const key = `${id}||${color}||${size}`;
      if (!grouped[key]) grouped[key] = { id, color, size, qty: 0 };
      grouped[key].qty += qty;
    }

    const uniqueIds = Array.from(idsSet);

    // fetch product details for only ids we have
    const foundProducts = uniqueIds.length
      ? await Products.find({ _id: { $in: uniqueIds } })
      : [];

    // If client did not provide phone, treat as inquiry; also inquiry if no product IDs matched.
    const clientNoPhone = !phone;
    if (clientNoPhone || foundProducts.length === 0) {
      const rawList = rawProducts.length ? escapeHtml(JSON.stringify(rawProducts)) : "(hech qanday mahsulot ko'rsatilmagan)";
      const inquiryMessage = `
        ${siteUrl} dan so'rov keldi: \n
        <b>● Ismi: </b>${escapeHtml(name)}
        <b>● Telefon Raqami: </b>${escapeHtml(phone || "(berilmagan)")}
        <b>● Yuborilgan Sana: </b>${currentDate}
        <b>● Yuborilgan Soati: </b>${currentTime}
      `;

      const targetChat = chatId || `-1003252321840`;
      await bot.sendMessage(targetChat, inquiryMessage, {
        parse_mode: "HTML",
      });
    } else {
      // Build product lines and compute totals (order mode)
      let overallTotal = 0;
      const productLines = Object.keys(grouped).map((key) => {
        const { id, color, size, qty } = grouped[key];
        const prod = foundProducts.find((p) => String(p._id) === String(id));
        if (!prod) {
          return `<b>• Product ID:</b> ${escapeHtml(id)}${color || size ? ` (${escapeHtml(color)} ${escapeHtml(size)})` : ""} — <i>Not found</i> (qty: ${qty})`;
        }
        // price fields are strings in the schema; normalize and parse
        const priceStr = prod.price || prod.original_price || "0";
        const normalized = String(priceStr).replace(/[^0-9.\-]/g, "");
        const unitPrice = parseFloat(normalized) || 0;
        const subtotal = unitPrice * qty;
        overallTotal += subtotal;
        // choose a display name (prefer Uzbek then English)
        const nameDisplay = prod.name_uz || prod.name_en || prod.name_ru || prod._id;
        const attrs = [];
        if (color) attrs.push(`rang: ${escapeHtml(color)}`);
        if (size) attrs.push(`o'lcham: ${escapeHtml(size)}`);
        const attrText = attrs.length ? ` (${attrs.join(", ")})` : "";
        return `<b>• ${escapeHtml(nameDisplay)}${attrText}:</b> soni ${qty} × ${unitPrice.toFixed(2)} = <b>${subtotal.toFixed(2)}</b>`;
      });

      const telegramMessage = `
        ${siteUrl} dan yangi buyurtma keldi: \n
        <b>● Ismi: </b>${escapeHtml(name)}
        <b>● Telefon Raqami: </b>${escapeHtml(phone)}
        <b>● Yuborilgan Sana: </b>${currentDate}
        <b>● Yuborilgan Soati: </b>${currentTime}\n
        <b>● Buyurtma tafsiloti:</b>\n\n${productLines.join("\n")}\n
        <b>● Jami:</b> <b>${overallTotal.toFixed(2)}</b>
      `;

      const targetChat = chatId || `-1002638687829`;
      await bot.sendMessage(targetChat, telegramMessage, {
        parse_mode: "HTML",
      });

    }

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
