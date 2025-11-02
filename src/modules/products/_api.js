const express = require("express");
const isLoggedIn = require("../../shared/auth/isLoggedIn");
const {
  addProducts,
  patchProducts,
  showProducts,
  deleteProducts,
  getProducts,
} = require("./_controllers");

const router = express.Router();

router.post("/products", addProducts);
router.get("/products", getProducts);
router.get("/products/:id", showProducts);
router.patch("/products/:id", isLoggedIn, patchProducts);
router.delete("/products/:id", isLoggedIn, deleteProducts);

module.exports = router;
