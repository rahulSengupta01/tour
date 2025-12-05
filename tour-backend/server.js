// tour-backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

const placesRoutes = require("./routes/places");
const createDefaultSuperAdmin = require("./utils/createSuperAdmin");

const adminRoutes = require("./routes/admin");
const superadminRoutes = require("./routes/superadmin");

const adminDashboardRoutes = require("./routes/adminDashboard"); // ✅ ONLY ONE IMPORT

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await createDefaultSuperAdmin(); // ⭐ Create superadmin
  })
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/auth/admin", adminRoutes);
app.use("/api/auth/admin", superadminRoutes);

app.use("/api/places", placesRoutes);

// ⭐ Final correct admin dashboard route
app.use("/api/auth/admin", adminDashboardRoutes);

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
