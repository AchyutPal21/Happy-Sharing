const File = require("../models/modelFile");
const sendMail = require("../services/emailService");
const emailTemplate = require("../services/emailTemplate");
const getFileInfo = require("../services/fileInfo");

exports.fileDownload = async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      throw new Error("Download Link has been expired...");
    }
    // console.log(file);
    const filePath = `${__dirname}/../${file.path}`;
    res.status(200).download(filePath);
  } catch (err) {
    console.log("🔥", err);
    res
      .status(404)
      .render("download", { error: err.message || "File not found..." });
  }
};

// File form the email
exports.downloadFromMail = async (req, res) => {
  try {
    const { uuid, emailTo, emailFrom } = req.body;
    const getFile = await File.findOne({ uuid });

    // console.log("✨✨✨", uuid);

    if (!uuid || !emailTo) {
      return res.status(422).send({ error: "All fields are required." });
    }

    if (getFile.sender) {
      return res
        .status(422)
        .send({ error: "Email for this file already send." });
    }

    getFile.sender = emailFrom;
    getFile.receiver = emailTo;
    const response = await getFile.save();
    // const response = await getFile.updateOne(
    //   { sender: emailFrom },
    //   { receiver: emailTo }
    // );

    // console.log("🎈🎈🎈🎈🎈🎈");

    // Send Email
    const { hoursRemain, minutesRemain, fileSize } = await getFileInfo.fileInfo(
      uuid
    );
    // console.log("🎄🎄🎄🎄", hoursRemain, minutesRemain, fileSize);
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "Happy Sharing | Easy File Sharing",
      text: `${emailFrom} shared you a file link.`,
      html: emailTemplate.emailTemp({
        emailFrom,
        fileSize,
        downloadLink: `${process.env.APP_BASE_URL}/file/${uuid}`,
        expires: `${hoursRemain}H : ${minutesRemain}M`,
      }),
    });

    return res.status(200).send({ success: "Mail send successfully!!!" });
  } catch (err) {
    console.log("🔥", err);
    res.status(500).send({ error: "Failed in sending mail." });
  }
};
