const express = require("express");
const multer = require("multer");
const { uploadFile, firebaseInitialized } = require("../utils/firebase");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!firebaseInitialized) {
      return res.status(500).json({
        error: "Firebase is NOT initialized. Cannot upload image.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const localPath = req.file.path;
    const fileName = `images/${Date.now()}-${req.file.originalname}`;

    const publicUrl = await uploadFile(localPath, fileName);

    res.json({ imageUrl: publicUrl });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
