const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Category = require("../models/Category");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// Get all projects (role-based)
router.get("/", protect, async (req, res) => {
  try {
    const { role, email } = req.user;
    const { search, category, status, priority, region, city, page, limit } =
      req.query;
    const fullAccessRoles = ["Admin", "Manager", "PM"];

    let query = {};
    if (!fullAccessRoles.includes(role)) {
      // Restricted roles: only projects where the user's email is in teamMembersss
      query.teamMembers = email;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All Categories") {
      query.category = category;
    }
    if (status && status !== "All Statuses") {
      query.status = status;
    }
    if (priority && priority !== "All Priorities") {
      query.priority = priority;
    }
    if (region && region.trim() !== "") {
      query.region = { $regex: region, $options: "i" };
    }
    if (city && city.trim() !== "") {
      query.city = { $regex: city, $options: "i" };
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get projects by category (role-based)
router.get("/category/:category", protect, async (req, res) => {
  try {
    const { role, email } = req.user;
    const { page, limit } = req.query;
    const fullAccessRoles = ["Admin", "Manager", "PM"];

    let query = { category: req.params.category };
    if (!fullAccessRoles.includes(role)) {
      query.teamMembers = email;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stats endpoint (must be before ":id" route)
router.get("/stats", protect, async (req, res) => {
  try {
    const { role, email } = req.user;
    const fullAccessRoles = ["Admin", "Manager", "PM"];

    // Build base filter — restricted users only see their assigned projects
    const baseFilter = fullAccessRoles.includes(role)
      ? {}
      : { teamMembers: email };

    const totalProjects = await Project.countDocuments(baseFilter);
    const inProgressCount = await Project.countDocuments({
      ...baseFilter,
      status: { $in: ["Mapping", "Installation", "Integration"] },
    });
    const completedCount = await Project.countDocuments({
      ...baseFilter,
      status: "Completed",
    });
    const criticalCount = await Project.countDocuments({
      ...baseFilter,
      priority: "Critical",
    });
    const totalBudgetAgg = await Project.aggregate([
      { $match: baseFilter },
      { $group: { _id: null, totalBudget: { $sum: "$budget" } } },
    ]);
    const totalBudget = totalBudgetAgg[0] ? totalBudgetAgg[0].totalBudget : 0;
    const categoryData = await Project.aggregate([
      { $match: baseFilter },
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
    ]);
    const statusData = await Project.aggregate([
      { $match: baseFilter },
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
    ]);
    const budgetData = await Project.find(baseFilter)
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

const ErrorResponse = require("../utils/errorResponse");

// Bulk add projects (Admin, Manager only)
router.post(
  "/bulk",
  protect,
  authorize("Admin", "Manager"),
  async (req, res, next) => {
    try {
      let projects = req.body.projects ?? req.body;

      if (!Array.isArray(projects)) {
        return next(new ErrorResponse("Projects must be an array", 400));
      }

      if (projects.length === 0) {
        return next(new ErrorResponse("At least one project is required", 400));
      }

      const validatedProjects = [];

      // Fetch all existing user emails once for fast validation
      const existingUserEmails = new Set(
        (await User.find().select("email").lean()).map((u) =>
          u.email.toLowerCase(),
        ),
      );

      // Validate each project
      for (let i = 0; i < projects.length; i++) {
        const projectData = projects[i];
        const {
          category,
          budget = 0,
          spent = 0,
          teamMembers = [],
        } = projectData;

        if (!projectData.title) {
          return next(
            new ErrorResponse(`Project at index ${i} requires a title`, 400),
          );
        }

        // Validate teamMembers emails exist in database
        if (Array.isArray(teamMembers) && teamMembers.length > 0) {
          const invalidEmails = teamMembers.filter(
            (email) =>
              !existingUserEmails.has(String(email).trim().toLowerCase()),
          );
          if (invalidEmails.length > 0) {
            return next(
              new ErrorResponse(
                `Project "${projectData.title}" contains invalid user email(s): ${invalidEmails.join(", ")}`,
                400,
              ),
            );
          }
        }

        if (category) {
          const cat = await Category.findOne({ name: category });
          if (!cat) {
            return next(
              new ErrorResponse(
                `Category "${category}" does not exist for project "${projectData.title}"`,
                400,
              ),
            );
          }

          if (budget > cat.budget) {
            return next(
              new ErrorResponse(
                `Project "${projectData.title}" budget (${budget}) cannot exceed category budget (${cat.budget})`,
                400,
              ),
            );
          }

          if (spent > cat.budget) {
            return next(
              new ErrorResponse(
                `Project "${projectData.title}" spent (${spent}) cannot exceed category budget (${cat.budget})`,
                400,
              ),
            );
          }

          projectData.categoryBudget = cat.budget;
        }
        validatedProjects.push(projectData);
      }

      if (validatedProjects.length === 0) {
        return res.status(400).json({
          message: "No valid projects to add",
        });
      }

      // Create all valid projects
      const createdProjects = await Project.insertMany(validatedProjects);

      res.status(201).json({
        message: `${createdProjects.length} project(s) created successfully`,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// Create a new project (Admin, Manager only)
router.post("/", protect, authorize("Admin", "Manager"), async (req, res) => {
  try {
    const { category, budget = 0, spent = 0 } = req.body;
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (!cat)
        return res
          .status(400)
          .json({ message: "Selected category does not exist" });
      if (budget > cat.budget) {
        return res
          .status(400)
          .json({ message: "Project budget cannot exceed category budget" });
      }
      if (spent > cat.budget) {
        return res
          .status(400)
          .json({ message: "Project spent cannot exceed category budget" });
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
      if (!cat)
        return res
          .status(400)
          .json({ message: "Selected category does not exist" });
      if (budget > cat.budget) {
        return res
          .status(400)
          .json({ message: "Project budget cannot exceed category budget" });
      }
      if (spent > cat.budget) {
        return res
          .status(400)
          .json({ message: "Project spent cannot exceed category budget" });
      }
      req.body.categoryBudget = cat.budget;
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    Object.assign(project, req.body);
    await project.save();

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
