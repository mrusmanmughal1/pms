export const getCatBadge = (cat) => {
  if (cat === "RMS") return "badge-rms";
  if (cat === "Smart Meter") return "badge-smart-meter";
  return "badge-smart-lock";
};
