// Simple CSV parser that supports quoted fields and maps headers to object keys
export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1);
  const projects = rows.map((line) => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      let v = values[i] !== undefined ? values[i].trim() : "";
      // Basic type conversions for known fields
      if (
        h === "budget" ||
        h === "spent" ||
        h === "progress" ||
        h === "longitude" ||
        h === "latitude"
      ) {
        v = v === "" ? 0 : Number(v);
      }
      if (h === "teamMembers" || h === "tags") {
        v =
          v === ""
            ? []
            : v
                .split(";")
                .map((s) => s.trim())
                .filter(Boolean);
      }
      if (h === "startDate" || h === "endDate") {
        v = v === "" ? undefined : new Date(v);
      }
      obj[h] = v;
    });
    return obj;
  });
  return projects;
}

// Parse a single CSV line into fields (handles quoted commas)
export function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// Convert an array of objects to a CSV file and trigger download
export function exportToCSV(data, filename = "data.csv") {
  if (!data || !data.length) return;

  // Only export string/number/date fields, skip complex objects like populated user info
  const headers = [
    "title",
    "description",
    "category",
    "status",
    "priority",
    "siteId",
    "tawalId",
    "region",
    "city",
    "teamLead",
    "budget",
    "spent",
    "progress",
    "startDate",
    "endDate",
    "teamMembers",
    "tags",
  ];

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          let cell =
            row[header] === null || row[header] === undefined
              ? ""
              : row[header];
          if (cell instanceof Date) {
            cell = cell.toISOString();
          } else if (Array.isArray(cell)) {
            cell = cell.join(";");
          } else if (typeof cell === "object") {
            // For object fields, try to extract name or stringify
            cell = cell.name || cell.title || "";
          }

          const cellString = cell.toString();
          if (
            cellString.includes(",") ||
            cellString.includes('"') ||
            cellString.includes("\n")
          ) {
            return `"${cellString.replace(/"/g, '""')}"`;
          }
          return cellString;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
