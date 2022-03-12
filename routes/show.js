const express = require("express");
const controller = require("../controller/controllerShow");

const router = express.Router();

router.route("/:uuid").get(controller.showDownload);

module.exports = router;
