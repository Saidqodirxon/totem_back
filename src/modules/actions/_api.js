const express = require("express");
const isLoggedIn = require("../../shared/auth/isLoggedIn");
const {
  addActions,
  patchActions,
  showActions,
  deleteActions,
  getActions,
} = require("./_controllers");

const router = express.Router();

router.post("/actions", addActions);
router.get("/actions", getActions);
router.get("/actions/:id", showActions);
router.patch("/actions/:id", isLoggedIn, patchActions);
router.delete("/actions/:id", isLoggedIn, deleteActions);

module.exports = router;
