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

router.post("/categories", addCategories);
router.get("/categories", getCategories);
router.get("/categories/:id", showCategories);
router.patch("/categories/:id", isLoggedIn, patchCategories);
router.delete("/categories/:id", isLoggedIn, deleteCategories);

module.exports = router;
