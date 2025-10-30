require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();


app.use(express.json());
app.use(cors());


const mongoUrl = process.env.MONGO_URI;
console.log("Mongo URI from env:", mongoUrl); 

if (!mongoUrl) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(mongoUrl)
  .then(() => console.log("✅ MongoDB connected..."))
  .catch(err => console.error("❌ MongoDB connection error:", err));


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Backend is running on port ${port}`);
});
