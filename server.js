// Imports
const connectDB = require("./config/db");
connectDB();
const app = require("./app");

// 👉 SERVER & PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at port:${port}`);
});
