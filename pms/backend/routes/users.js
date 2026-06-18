const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// Get all users (accessible by Admin and Manager)
router.get("/", protect, authorize("Admin", "Manager"), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user (Admin only)
router.put("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role) {
      user.role = role;
    }
    if (status) {
      user.status = status;
    }
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (Admin only)
router.delete("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
