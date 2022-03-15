const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
connectDB();
const File = require("./models/modelFile");

async function deleteData() {
  try {
    const pastDate = new Date(Date.now() - 86400000);
    const files = await File.find({ createdAt: { $lt: pastDate } });

    let delFiles = 0;
    if (files.length) {
      console.log(`Expired files:${files.length}`);
      for (let file of files) {
        fs.unlinkSync(path.join(__dirname, `/${file.path}`));
        console.log(path.join(__dirname, `/${file.path}`));
        await file.remove();
        console.log(
          `Successfully deleted ${
            file.filename
          }\nDeleted file Count:${++delFiles}`
        );
      }
    } else {
      console.log(`No Expired file found.`);
    }

    console.log("Expired files check successful !!!");
  } catch (err) {
    console.error("🔥 While deleting file", err);
  }
}

deleteData().then((data) => {
  console.log("Closing File Check...");
  process.exit();
});
