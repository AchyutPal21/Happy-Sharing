const express = require("express");
const downloadFile = require("../controller/controllerDownload");

const router = express.Router();

router.route("/:uuid").get(downloadFile.fileDownload);

router.route("/email").post(downloadFile.downloadFromMail);

module.exports = router;
