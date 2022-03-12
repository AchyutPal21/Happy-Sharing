const { v4: uuid4 } = require("uuid");
const File = require("../models/modelFile");

exports.uploadFile = async function (req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(500)
        .json({ error: "Please Try Again, File not found 😕" });
    }

    const fileDB = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      size: req.file.size,
      path: req.file.path,
      createdAt: new Date(),
    });

    const response = await fileDB.save();
    // console.log(response);
    // http://localhost/3000/file/1234didsaluid-34987sdfod
    res
      .status(200)
      .json({ file: `${process.env.APP_BASE_URL}/file/${response.uuid}` });

    next();
  } catch (err) {
    console.log("🔥", err);
    res.status(500).json({ error: err.message });
  }
};
