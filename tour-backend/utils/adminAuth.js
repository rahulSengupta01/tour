// tour-backend/utils/adminAuth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    const token = header?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.adminId) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    // load admin from DB to confirm existence and role
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(401).json({ msg: "Admin not found" });

    // attach verified info
    req.adminId = admin._id;
    req.role = admin.role;
    req.place_id = admin.place_id || null;

    next();
  } catch (err) {
    console.error("adminAuth error:", err.message || err);
    return res.status(401).json({ msg: "Token invalid or expired" });
  }
};
