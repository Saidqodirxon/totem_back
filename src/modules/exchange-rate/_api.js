const express = require("express");
const { getExchangeRate, updateExchangeRate } = require("./_controllers");
const isLoggedIn = require("../../shared/auth/isLoggedIn");

const router = express.Router();

// GET /exchange-rate - barcha foydalanuvchilar o'qishi mumkin
router.get("/", getExchangeRate);

// PUT /exchange-rate - faqat admin o'zgartira oladi
router.put("/", isLoggedIn, updateExchangeRate);

module.exports = router;
