// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const auth = require("../utils/authMiddleware");

// Register
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("mobile").notEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  authController.register
);

// Login
router.post(
  "/login",
  [body("mobile").notEmpty(), body("password").notEmpty()],
  authController.login
);

// Logged in user info
router.get("/me", auth, authController.getMe);

module.exports = router;
