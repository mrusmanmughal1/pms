export const getCatBadge = (cat) => {
  if (cat === "RMS") return "badge-rms";
  if (cat === "Smart Meter") return "badge-smart-meter";
  return "badge-smart-lock";
};
 export const getCategoryColor = (cat) => {
    switch (cat) {
      case "RMS":
        return "var(--cat-rms)";
      case "Smart meter":
        return "var(--cat-smartmeter)";
      case "Smart Lock":
        return "var(--cat-smartlock)";
      default:
        return "var(--primary-color)";
    }
  };
  export  const getPriorityBadge = (prio) => {
    if (prio === "Critical") return "priority-critical";
    return "priority-high";
  };