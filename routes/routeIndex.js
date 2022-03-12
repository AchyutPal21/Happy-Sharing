const express = require("express");
const controllerIndex = require("../controller/controllerIndex");

const router = express.Router();

router.route("/").get(controllerIndex.renderHome);

module.exports = router;
