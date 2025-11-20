require("dotenv").config();
const Contacts = require("./Contacts");
const Products = require("../products/Products");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
});

const siteUrl = process.env.MAIN_SITE;
const chatId = process.env.CHAT_ID;

// HTML escape
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const postContact = async (req, res) => {
  try {
    const { name, phone, products } = req.body;

    // minimal verification
    if (!name) {
      return res.status(400).json({ error: "Имя обязательно." });
    }

    if (
      !phone &&
      (!products || (Array.isArray(products) && products.length === 0))
    ) {
      return res
        .status(400)
        .json({ error: "Укажите телефон или список товаров." });
    }

    // Save to DB
    const contact = new Contacts({ name, phone, products });
    const savedContact = await contact.save();

    // Format time
    const dateOptions = { timeZone: "Asia/Tashkent" };
    const createdAt = new Date(savedContact.createdAt);
    const currentDate = createdAt.toLocaleDateString("ru-RU", dateOptions);
    const currentTime = createdAt.toLocaleTimeString("ru-RU", dateOptions);

    // Normalize incoming products
    const rawProducts = Array.isArray(products) ? products : [];
    const grouped = {};
    const idsSet = new Set();

    for (const item of rawProducts) {
      if (!item) continue;
      let id,
        color = "",
        size = "",
        qty = 1;

      if (typeof item === "string" || typeof item === "number") {
        id = String(item);
      } else if (typeof item === "object") {
        id = String(item.id || item._id || item.productId || "");
        color = item.color ? String(item.color) : "";
        size = item.size ? String(item.size) : "";
        const rawQty = item.qty ?? item.quantity ?? item.count ?? 1;
        qty = Number(rawQty) || 1;
      }

      if (!id) continue;

      idsSet.add(id);
      const key = `${id}||${color}||${size}`;
      if (!grouped[key]) grouped[key] = { id, color, size, qty: 0 };
      grouped[key].qty += qty;
    }

    const uniqueIds = Array.from(idsSet);
    const foundProducts = uniqueIds.length
      ? await Products.find({ _id: { $in: uniqueIds } })
      : [];

    const isInquiry = !phone || foundProducts.length === 0;

    // ❗ РУСКИЙ ВАРИАНТ ДЛЯ ЗАЯВКИ БЕЗ ТОВАРОВ (inquiry)
    if (isInquiry) {
      const msg = `
🔵 <b>С сайта ${escapeHtml(siteUrl)} поступил запрос</b>\n
<b>• Имя:</b> ${escapeHtml(name)}
<b>• Телефон:</b> ${escapeHtml(phone || "(не указан)")}

<b>• Дата отправки:</b> ${currentDate}
<b>• Время отправки:</b> ${currentTime}

<b>• Товары:</b> (не указаны или не найдены)
`;

      await bot.sendMessage(chatId || "-1003252321840", msg, {
        parse_mode: "HTML",
      });

      return res.status(200).json({
        message: "Заявка сохранена и отправлена.",
        data: savedContact,
      });
    }

    // ❗ ЗАКАЗ С ТОВАРАМИ — РУСКИЙ ВАРИАНТ
    let total = 0;

    const productLines = Object.values(grouped).map(
      ({ id, color, size, qty }) => {
        const prod = foundProducts.find((p) => String(p._id) === String(id));
        if (!prod) {
          return `<b>• Товар ID:</b> ${escapeHtml(
            id
          )} — <i>не найден</i> (кол-во: ${qty})`;
        }

        let priceStr = prod.price || prod.original_price || "0";
        const normalized = priceStr.toString().replace(/[^0-9.]/g, "");
        const price = parseFloat(normalized) || 0;

        const subtotal = price * qty;
        total += subtotal;

        const nameDisplay =
          prod.name_ru || prod.name_uz || prod.name_en || prod._id;

        const attrs = [];
        if (color) attrs.push(`цвет: ${escapeHtml(color)}`);
        if (size) attrs.push(`размер: ${escapeHtml(size)}`);
        const attrText = attrs.length ? ` (${attrs.join(", ")})` : "";

        return `• <b>${escapeHtml(
          nameDisplay
        )}${attrText}</b>: ${qty} × ${price.toFixed(2)} = <b>${subtotal.toFixed(
          2
        )}</b>`;
      }
    );

    const orderMessage = `
🟢 <b>Новый заказ с сайта ${escapeHtml(siteUrl)}</b>\n
<b>• Имя:</b> ${escapeHtml(name)}
<b>• Телефон:</b> ${escapeHtml(phone)}

<b>• Дата:</b> ${currentDate}
<b>• Время:</b> ${currentTime}

<b>• Состав заказа:</b>\n
${productLines.join("\n")}

<b>Итого:</b> <b>${total.toFixed(2)}</b>
`;

    await bot.sendMessage(chatId || "-1002638687829", orderMessage, {
      parse_mode: "HTML",
    });

    return res.status(200).json({
      message: "Заказ сохранён и отправлен.",
      data: savedContact,
    });
  } catch (error) {
    console.error("Ошибка:", error.message);
    return res
      .status(500)
      .json({ error: "Произошла ошибка при обработке запроса." });
  }
};

module.exports = postContact;
