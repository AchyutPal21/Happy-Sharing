const path = require("path");
const express = require("express");

const app = express();
const filesRouter = require("./routes/routeFile");
const showRouter = require("./routes/show");
const downloadFile = require("./routes/downloadFile");
const routeIndex = require("./routes/routeIndex");

// Express Parse JSON
app.use(express.json());

// Static Files
app.use(express.static("public"));

// Template Engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// App Routes
app.use("/", routeIndex);
app.use("/api/v1", filesRouter);
app.use("/file", showRouter);
app.use("/file/download", downloadFile);

module.exports = app;
