// tour-backend/utils/createSuperAdmin.js

const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

async function createDefaultSuperAdmin() {
  try {
    // Check if superadmin already exists
    const existing = await Admin.findOne({ role: "superadmin" });

    if (existing) {
      console.log("Superadmin already exists.");
      return;
    }

    console.log("Creating default superadmin...");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      name: "Super Admin",
      mobile: "9999999999",
      password: hashedPassword,
      role: "superadmin",
      place_id: null, // superadmin does not manage a place
    });

    console.log("✅ Default Superadmin Created:");
    console.log("   Mobile: 9999999999");
    console.log("   Password: admin123");
  } catch (err) {
    console.log("Error creating superadmin:", err);
  }
}

module.exports = createDefaultSuperAdmin;
