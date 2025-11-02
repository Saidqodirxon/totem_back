const express = require("express");
const isLoggedIn = require("../../shared/auth/isLoggedIn");
const {
  addFaqs,
  patchFaqs,
  showFaqs,
  deleteFaqs,
  getFaqs,
} = require("./_controllers");

const router = express.Router();

router.post("/faqs", addFaqs);
router.get("/faqs", getFaqs);
router.get("/faqs/:id", showFaqs);
router.patch("/faqs/:id", isLoggedIn, patchFaqs);
router.delete("/faqs/:id", isLoggedIn, deleteFaqs);

module.exports = router;
