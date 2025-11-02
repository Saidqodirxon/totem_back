const express = require("express");
const isLoggedIn = require("../../shared/auth/isLoggedIn");
const {
  postRegisterUser,
  postLoginUser,
  getMe,
  editUserMe,
  Main,
  Dev,
} = require("./_controllers");
const isAdmin = require("../../shared/auth/isAdmin");
const upload = require("../../shared/upload");
const isSuperAdmin = require("../../shared/auth/isSuperAdmin");

const router = express.Router();

router.post("/login", postLoginUser);
router.get("/admin/me", isLoggedIn, getMe);
router.patch("/admin/me", isLoggedIn, editUserMe);

router.get("/", Main);
router.get("/dev", Dev);

module.exports = router;
