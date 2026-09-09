// Maps the recognised Sheet 1 cell values onto the pill classes already
// defined in index.css, so the table reads the same as the rest of PMS.
const VARIANT_CLASS = {
  required: "pill-approved",
  "not-required": "pill-planning",
  yes: "pill-mapping",
  no: "pill-planning",
  stc: "pill-installation",
};

function getVariant(value) {
  const v = value.toLowerCase().trim();
  if (v === "required") return "required";
  if (v === "not required") return "not-required";
  if (v === "yes") return "yes";
  if (v === "no") return "no";
  if (v.includes("stc odu")) return "stc";
  return "default";
}

export default function CellBadge({ value }) {
  const variant = getVariant(value);

  if (variant === "default") {
    return <span className="cell-plain">{value || "—"}</span>;
  }

  return <span className={`cell-badge ${VARIANT_CLASS[variant]}`}>{value}</span>;
}
