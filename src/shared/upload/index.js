const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config(); // .env faylini yuklash uchun

// SITE_URL ni env dan olish, agar yo'q bo'lsa default qiymat
const SITE_URL = process.env.SITE_URL;

// Public papkasini tekshirish va yaratish
const ensurePublicFolder = () => {
  const publicPath = path.join(__dirname, "../public");
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }
};

// Multer sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensurePublicFolder();
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Single file upload handler
const handleSingleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Fayl yuklanmadi" });
    }

    const data = [
      {
        url: `${SITE_URL}/public/${req.file.filename}`,
        id: req.file.filename,
      },
    ];

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Multiple file upload handler
const handleMultipleUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Fayllar yuklanmadi" });
    }

    const data = req.files.map((file) => ({
      url: `${SITE_URL}/public/${file.filename}`,
      id: file.filename,
    }));

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Faylni o'chirish handler
const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID kiritilmadi" });
    }

    const filePath = path.join(__dirname, "../../../public", id);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Fayl muvaffaqiyatli o'chirildi" });
    } else {
      res.status(404).json({ error: "Fayl topilmadi" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upload,
  handleSingleUpload,
  handleMultipleUpload,
  deleteFile,
};
