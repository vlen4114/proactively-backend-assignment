const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const speakerRoutes = require("./routes/speakerRoutes");
const sessionRoutes = require("./routes/sessionRoutes");



dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/speaker", speakerRoutes);
app.use("/api/session", sessionRoutes);


sequelize
  .sync()
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
