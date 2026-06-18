const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Category = require("../models/Category");
const { protect, authorize } = require("../middleware/auth");

// Get all projects
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get projects by category
router.get("/category/:category", protect, async (req, res) => {
  try {
    const projects = await Project.find({ category: req.params.category }).sort(
      { createdAt: -1 },
    );
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stats endpoint (must be before ":id" route)
router.get("/stats", protect, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const inProgressCount = await Project.countDocuments({
      status: "In Progress",
    });
    const completedCount = await Project.countDocuments({
      status: "Completed",
    });
    const criticalCount = await Project.countDocuments({
      priority: "Critical",
    });
    const totalBudgetAgg = await Project.aggregate([
      { $group: { _id: null, totalBudget: { $sum: "$budget" } } },
    ]);
    const totalBudget = totalBudgetAgg[0] ? totalBudgetAgg[0].totalBudget : 0;
    const categoryData = await Project.aggregate([
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
    ]);
    const statusData = await Project.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
    ]);
    const budgetData = await Project.find()
      .sort({ budget: -1 })
      .limit(5)
      .select("title budget spent")
      .lean();
    res.status(200).json({
      totalProjects,
      inProgressCount,
      completedCount,
      criticalCount,
      totalBudget,
      categoryData,
      statusData,
      budgetData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single project
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new project (Admin, Manager only)
router.post("/", protect, authorize("Admin", "Manager"), async (req, res) => {
  try {
    const { category, budget = 0, spent = 0 } = req.body;
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (!cat) return res.status(400).json({ message: "Selected category does not exist" });
      if (budget > cat.budget) {
        return res.status(400).json({ message: "Project budget cannot exceed category budget" });
      }
      if (spent > cat.budget) {
        return res.status(400).json({ message: "Project spent cannot exceed category budget" });
      }
      req.body.categoryBudget = cat.budget;
    }

    const project = new Project(req.body);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a project (Admin, Manager only)
router.put("/:id", protect, authorize("Admin", "Manager"), async (req, res) => {
  try {
    const { category, budget = 0, spent = 0 } = req.body;
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (!cat) return res.status(400).json({ message: "Selected category does not exist" });
      if (budget > cat.budget) {
        return res.status(400).json({ message: "Project budget cannot exceed category budget" });
      }
      if (spent > cat.budget) {
        return res.status(400).json({ message: "Project spent cannot exceed category budget" });
      }
      req.body.categoryBudget = cat.budget;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a project (Admin only)
router.delete("/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
