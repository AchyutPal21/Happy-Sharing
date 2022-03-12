const File = require("../models/modelFile");

module.exports.fileInfo = async function (uuid) {
  try {
    const getFile = await File.findOne({ uuid });
    // File Expiring Time
    let exp =
      24 -
      (new Date().getTime() - new Date(`${getFile.createdAt}`).getTime()) /
        3600000;
    let hoursRemain = Math.trunc(exp);
    let minutesRemain = Math.trunc((exp.toFixed(2) - hoursRemain) * 60);

    if (minutesRemain > 59) {
      hoursRemain += Math.trunc(minutesRemain / 60);
      minutesRemain = minutesRemain / 60 - Math.trunc(minutesRemain / 60);
    }

    // File Size
    let fileSize =
      getFile.size > 1048576
        ? `${(getFile.size / 1048576).toFixed(2)} MB`
        : getFile.size > 1024
        ? `${(getFile.size / 1024).toFixed(2)} KB`
        : `${getFile.size.toFixed(2)} Bytes`;

    return { hoursRemain, minutesRemain, fileSize };
  } catch (err) {
    console.log("🔥", err);
    throw err;
  }
};
