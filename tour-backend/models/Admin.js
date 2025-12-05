// tour-backend/models/Admin.js
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // IMPORTANT: each admin manages only ONE place
place_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Place",
  required: function () {
    return this.role !== "superadmin"; // required only for normal admins
  },
},


  role: { type: String, enum: ["admin", "superadmin"], default: "admin" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", AdminSchema);
