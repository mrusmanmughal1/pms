const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Project = require("../models/Project");
const { protect, authorize } = require("../middleware/auth");

// Get categories based on role
router.get("/", protect, async (req, res) => {
  try {
    const { role, email } = req.user;
    const fullAccessRoles = ["Admin", "Manager", "PM"];

    let categories;
    if (fullAccessRoles.includes(role)) {
      categories = await Category.find().sort({ name: 1 });
    } else {
      // Find projects where the user is a team member
      const userProjects = await Project.find({ teamMembers: email }).select(
        "category",
      );
      const userCategoryNames = [
        ...new Set(userProjects.map((p) => p.category)),
      ];
      categories = await Category.find({
        name: { $in: userCategoryNames },
      }).sort({ name: 1 });
    }

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new category - admin only
router.post("/", protect, authorize("Admin"), async (req, res) => {
  try {
    const { name, budget = 0 } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required" });
    if (budget < 0)
      return res.status(400).json({ message: "Budget must be at least 0" });

    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name, budget });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a category budget - admin only
router.put("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const { name, budget } = req.body;
    if (budget == null || Number(budget) < 0) {
      return res
        .status(400)
        .json({ message: "Budget must be provided and at least 0" });
    }
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (name) {
      const existing = await Category.findOne({
        name,
        _id: { $ne: category._id },
      });
      if (existing)
        return res
          .status(400)
          .json({ message: "Another category with this name already exists" });
      category.name = name;
    }
    category.budget = Number(budget);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a category - admin only
router.delete("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
