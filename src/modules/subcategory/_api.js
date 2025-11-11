const express = require("express");
const isLoggedIn = require("../../shared/auth/isLoggedIn");
const {
  addCategories,
  patchCategories,
  showCategories,
  deleteCategories,
  getCategories,
} = require("./_controllers");

const router = express.Router();

router.post("/subcategories", addCategories);
router.get("/subcategories", getCategories);
router.get("/subcategories/:id", showCategories);
router.patch("/subcategories/:id", isLoggedIn, patchCategories);
router.delete("/subcategories/:id", isLoggedIn, deleteCategories);

module.exports = router;
