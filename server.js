// Imports
const connectDB = require("./config/db");
connectDB();

const cors = require("cors");

// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CORS_CLIENTS.split(","),
};

const app = require("./app");

app.use(cors(corsOptions));

// 👉 SERVER & PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening at port:${port}`);
});
