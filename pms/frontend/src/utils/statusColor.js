// based on status return a color
export const getStatusColor = (status) => {
  switch (status) {
    case "Planning":
      return "var(--status-planning)";
    case "In Progress":
      return "var(--status-inprogress)";
    case "Testing":
      return "var(--status-testing)";
    case "Completed":
      return "var(--status-completed)";
    case "On Hold":
      return "var(--status-onhold)";
    default:
      return "var(--text-secondary)";
  }
};

// based on priority return a color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return "var(--status-low)";
    case "Medium":
      return "var(--status-medium)";
    case "High":
      return "var(--status-high)";
    case "Critical":
      return "var(--status-critical)";
    default:
      return "var(--text-secondary)";
  }
};

// based on request type return a color
export const getRequestTypeColor = (requestType) => {
  switch (requestType) {
    case "Work Order Request":
      return "var(--status-planning)";
    case "Work Order Issuance":
      return "var(--status-inprogress)";
    case "Materials Request":
      return "var(--status-testing)";
    default:
      return "var(--text-secondary)";
  }
};

// based on wo status return a color
export const getWoStatusColor = (woStatus) => {
  switch (woStatus) {
    case "Pending":
      return "var(--status-planning)";
    case "Approved":
      return "var(--status-inprogress)";
    case "Rejected":
      return "var(--status-testing)";
    default:
      return "var(--text-secondary)";
  }
};

// based on materials status return a color
export const getMaterialsStatusColor = (materialsStatus) => {
  switch (materialsStatus) {
    case "Pending":
      return "var(--status-planning)";
    case "Approved":
      return "var(--status-inprogress)";
    case "Rejected":
      return "var(--status-testing)";
    default:
      return "var(--text-secondary)";
  }
};
