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
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { siteId: { $regex: search, $options: "i" } },
        { tawalId: { $regex: search, $options: "i" } },
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
      query.region = region.trim();
    }
    if (city && city.trim() !== "") {
      query.city = city.trim();
    }

    const isAll = String(limit).toLowerCase() === "all";
    const pageNum = isAll ? 1 : parseInt(page) || 1;
    const limitNum = isAll ? 0 : parseInt(limit) || 20;
    const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;

    const total = await Project.countDocuments(query);
    let projectsQuery = Project.find(query).sort({ createdAt: -1 });
    if (limitNum > 0) {
      projectsQuery = projectsQuery.skip(skip).limit(limitNum);
    }
    const projects = await projectsQuery;

    res.status(200).json({
      meta: {
        total,
        page: pageNum,
        limit: limitNum > 0 ? limitNum : total,
        totalPages: limitNum > 0 ? Math.ceil(total / limitNum) || 1 : 1,
      },
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handler: Get all projects without authentication (public access)
const getPublicProjects = async (req, res) => {
  try {
    const { search, category, status, priority, region, city } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { siteId: { $regex: search, $options: "i" } },
        { tawalId: { $regex: search, $options: "i" } },
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

    const projects = await Project.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      meta: {
        total: projects.length,
      },
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get("/public/projects", getPublicProjects);
router.get("/public", getPublicProjects);

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

// Filters endpoint: distinct regions & cities (must be before /:id route)
router.get("/filters", protect, async (req, res) => {
  try {
    const { role, email } = req.user;
    const fullAccessRoles = ["Admin", "Manager", "PM"];
    const baseFilter = fullAccessRoles.includes(role)
      ? {}
      : { teamMembers: email };

    const [regions, cities] = await Promise.all([
      Project.distinct("region", {
        ...baseFilter,
        region: { $nin: [null, ""] },
      }),
      Project.distinct("city", { ...baseFilter, city: { $nin: [null, ""] } }),
    ]);

    res.status(200).json({
      regions: regions.filter(Boolean).sort(),
      cities: cities.filter(Boolean).sort(),
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

      // Check for duplicate projects (same title AND category) within the uploaded batch
      const seenBatchKeys = new Set();
      const duplicateInBatch = [];

      for (const p of projects) {
        const title = (p.title || p.name || "").trim();
        const category = (p.category || "").trim();
        if (!title) continue;

        const key = `${title.toLowerCase()}:::${category.toLowerCase()}`;
        if (seenBatchKeys.has(key)) {
          duplicateInBatch.push(
            category ? `"${title}" (${category})` : `"${title}"`,
          );
        } else {
          seenBatchKeys.add(key);
        }
      }

      if (duplicateInBatch.length > 0) {
        const uniqueDups = [...new Set(duplicateInBatch)];
        return next(
          new ErrorResponse(
            `Duplicate project(s) under the same category found in the uploaded file: ${uniqueDups.join(", ")}`,
            400,
          ),
        );
      }

      // Check for projects that already exist with the same title AND category in the database
      const dbCheckConditions = projects
        .map((p) => {
          const title = (p.title || p.name || "").trim();
          const category = (p.category || "").trim();
          if (!title) return null;

          const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const condition = {
            title: new RegExp(`^${escapedTitle}$`, "i"),
          };
          if (category) {
            const escapedCat = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            condition.category = new RegExp(`^${escapedCat}$`, "i");
          }
          return condition;
        })
        .filter(Boolean);

      if (dbCheckConditions.length > 0) {
        const existingProjects = await Project.find({
          $or: dbCheckConditions,
        })
          .select("title category")
          .lean();

        if (existingProjects.length > 0) {
          const existingFormatted = existingProjects
            .map((p) =>
              p.category ? `"${p.title}" (${p.category})` : `"${p.title}"`,
            )
            .join(", ");
          return next(
            new ErrorResponse(
              `The following project(s) already exist under the same category in the system: ${existingFormatted}`,
              400,
            ),
          );
        }
      }

      // Validate each project
      for (let i = 0; i < projects.length; i++) {
        const projectData = projects[i];
        if (projectData.name && !projectData.title) {
          projectData.title = projectData.name;
        }
        const {
          category,
          budget = 0,
          spent = 0,
          teamMembers = [],
          teamLead,
        } = projectData;

        if (!projectData.title) {
          return next(
            new ErrorResponse(`Project at index ${i} requires a title`, 400),
          );
        }

        // Validate teamLead email exists in database
        if (typeof teamLead === "string" && teamLead.trim() !== "") {
          const teamLeadEmail = teamLead.trim().toLowerCase();
          if (!existingUserEmails.has(teamLeadEmail)) {
            return next(
              new ErrorResponse(
                `Project "${projectData.title}" has a team lead with an invalid user email: ${teamLead}`,
                400,
              ),
            );
          }
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
    const { category, siteId, tawalId, budget = 0, spent = 0 } = req.body;
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

    // Site ID & Tawal ID must be unique — reject duplicates on create
    if (siteId && siteId.trim() !== "") {
      const existingSite = await Project.findOne({ siteId: siteId.trim() });
      if (existingSite) {
        return res.status(400).json({
          message: `A project with Site ID "${siteId.trim()}" already exists`,
        });
      }
    }
    if (tawalId && tawalId.trim() !== "") {
      const existingTawal = await Project.findOne({ tawalId: tawalId.trim() });
      if (existingTawal) {
        return res.status(400).json({
          message: `A project with Tawal ID "${tawalId.trim()}" already exists`,
        });
      }
    }

    const project = new Project(req.body);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a project (roles that can edit at least one module — aligned with frontend)
router.put(
  "/:id",
  protect,
  authorize(
    "Admin",
    "Manager",
    "PM",
    "Logistics",
    "Coordinator",
    "Integration & Support",
    "Document Controller",
    "Closeout",
  ),
  async (req, res, next) => {
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

      if (
        req.body.mapping?.woRequest?.status === "Requested" &&
        (!req.body.mapping?.woRequest?.fileUrl ||
          !req.body.mapping?.woRequest?.fileUrl.trim())
      ) {
        return res.status(400).json({
          message: "Mapping file is required when WO Request is Requested",
        });
      }

      if (
        req.body.mapping?.woIssuance?.status === "Approved" &&
        (!req.body.mapping?.woIssuance?.woNumber ||
          !req.body.mapping?.woIssuance?.woNumber.trim())
      ) {
        return res.status(400).json({
          message: "WO Number is required when WO Issuance is Approved",
        });
      }

      const project = await Project.findById(req.params.id);
      if (!project)
        return res.status(404).json({ message: "Project not found" });

      Object.assign(project, req.body);
      await project.save();

      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// Bulk delete projects (Admin, Manager only) - must be before /:id route
router.post(
  "/bulk-delete",
  protect,
  authorize("Admin", "Manager"),
  async (req, res) => {
    try {
      const ids =
        req.body.ids ||
        req.body.projectIds ||
        (Array.isArray(req.body) ? req.body : []);

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          message: "Please provide an array of project IDs to delete",
        });
      }

      const result = await Project.deleteMany({ _id: { $in: ids } });
      res.status(200).json({
        message: `${result.deletedCount} project(s) deleted successfully`,
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.delete(
  "/bulk",
  protect,
  authorize("Admin", "Manager"),
  async (req, res) => {
    try {
      const ids =
        req.body.ids ||
        req.body.projectIds ||
        (Array.isArray(req.body) ? req.body : []);

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          message: "Please provide an array of project IDs to delete",
        });
      }

      const result = await Project.deleteMany({ _id: { $in: ids } });
      res.status(200).json({
        message: `${result.deletedCount} project(s) deleted successfully`,
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// Delete a project (Admin, Manager)
router.delete(
  "/:id",
  protect,
  authorize("Admin", "Manager"),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project)
        return res.status(404).json({ message: "Project not found" });
      await project.deleteOne();
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = router;
