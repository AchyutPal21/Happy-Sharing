const path = require("path");
const express = require("express");
const multer = require("multer");
const controller = require("../controller/controllerFile");
const req = require("express/lib/request");
const { nextTick } = require("process");
const router = express.Router();

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: fileStorageEngine,
  limit: { filesize: 1048576 * 100 },
}).single("myfile");

router.route("/file").post(
  upload,
  (req, res, next) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(500).json({ error: err.message });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json({ error: err.message });
      }
    });
    next();
  },
  controller.uploadFile
);

module.exports = router;
