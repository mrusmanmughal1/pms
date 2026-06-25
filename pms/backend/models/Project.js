const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
      category: {
        type: String,
        // No enum - categories are managed dynamically via the categories collection
      },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Testing", "Completed", "On Hold"],
      default: "Planning",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    teamLead: {
      type: String,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
      default: 0,
    },
    spent: {
      type: Number,
      default: 0,
    },
    teamMembers: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    categoryBudget: {
      type: Number,
      default: 0,
      min: [0, 'Category budget must be at least 0'],
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    mapping: {
      woRequest: {
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      woIssuance: {
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      materialsRequest: {
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      generalRemarks: { type: String, default: "" }
    },
    installation: {
      tcnRequest: {
        tcnNumber: { type: String, default: "" },
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      teamsMaterialsMobilization: {
        status: { type: String, enum: ["Pending", "In Progress", "Completed", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      tcnApproval: {
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      siteInstallation: {
        type: { type: String, enum: ["RMS", "Smart Lock", "Smart Meter", "Other"], default: "RMS" },
        status: { type: String, enum: ["Pending", "In Progress", "Completed", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      generalRemarks: { type: String, default: "" }
    },
    integration: {
      alarmsConfiguration: {
        status: { type: String, enum: ["Pending", "In Progress", "Completed", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      annexNumber: {
        number: { type: String, default: "" },
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      tenantsIntegration: {
        status: { type: String, enum: ["Pending", "In Progress", "Completed", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      generalRemarks: { type: String, default: "" }
    },
    closeout: {
      patTcn: {
        number: { type: String, default: "" },
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      patStatus: {
        status: { type: String, enum: ["Pending", "Approved", "Rejected", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      invoicing: {
        status: { type: String, enum: ["Pending", "In Progress", "Completed", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      capitalisationSheetUpdate: {
        status: { type: String, enum: ["Pending", "In Progress", "Completed", "N/A"], default: "Pending" },
        date: { type: Date },
        remarks: { type: String, default: "" }
      },
      generalRemarks: { type: String, default: "" }
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", ProjectSchema);
