const express = require("express");
const isLoggedIn = require("../../shared/auth/isLoggedIn");
const {
  addNews,
  patchNews,
  showNews,
  deleteNews,
  getNews,
} = require("./_controllers");

const router = express.Router();

router.post("/news", addNews);
router.get("/news", getNews);
router.get("/news/:id", showNews);
router.patch("/news/:id", isLoggedIn, patchNews);
router.delete("/news/:id", isLoggedIn, deleteNews);

module.exports = router;
