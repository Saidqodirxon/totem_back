const express = require("express");
const {
  upload,
  handleSingleUpload,
  handleMultipleUpload,
  deleteFile,
} = require("../shared/upload");

const router = express.Router();

// Single file upload route
router.post("/single", upload.single("file"), handleSingleUpload);

// Multiple file upload route
router.post("/multiple", upload.array("files"), handleMultipleUpload);

// Faylni o'chirish route
router.delete("/file/:id", deleteFile);

module.exports = router;
