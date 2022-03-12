const File = require("../models/modelFile");
const getFileInfo = require("../services/fileInfo");

// File Downloding Page
exports.showDownload = async (req, res) => {
  try {
    const getFile = await File.findOne({ uuid: req.params.uuid });
    if (!getFile) throw new Error("Link has been expired 🥺...");

    const { hoursRemain, minutesRemain, fileSize } = await getFileInfo.fileInfo(
      getFile.uuid
    );

    // Rendering the Download Page
    res.status(200).render("download", {
      uuid: getFile.uuid,
      fileName: getFile.filename,
      fileSize,
      fileExp: `${hoursRemain}H : ${minutesRemain}M`,
      downloadLink: `${process.env.APP_BASE_URL}/file/download/${getFile.uuid}`,
    });
  } catch (err) {
    console.log("🔥", err);
    res.status(500).render("download", {
      error: err.message || "Something went wrong 🤔!!!",
      home: `${process.env.APP_BASE_URL}`,
    });
  }
};
