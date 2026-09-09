import * as XLSX from "xlsx-js-style";
import { getSitesInPath } from "./geofence";

const COLUMN_WIDTHS = [
  { wch: 6 },
  { wch: 32 },
  { wch: 16 },
  { wch: 14 },
  { wch: 14 },
  { wch: 12 },
  { wch: 12 },
  { wch: 18 },
  { wch: 10 },
  { wch: 12 },
  { wch: 16 },
];

// Indigo header band, matching --primary-color in index.css.
const HEADER_STYLE = {
  font: { bold: true, color: { rgb: "FFFFFF" } },
  fill: { fgColor: { rgb: "4F46E5" } },
  alignment: { horizontal: "center" },
};

function buildRows(plan) {
  return plan.route.map((site, index) => ({
    Stop: index + 1,
    Site_Name: site.name,
    Site_ID: site.siteId ?? "",
    City: site.city,
    Region: site.region ?? "",
    Latitude: site.lat,
    Longitude: site.lng,
    Type: site.type ?? "",
    Priority: site.priority ?? "",
    Status: site.status,
    Proposed_Date: plan.date,
  }));
}

function styleHeaderRow(worksheet) {
  if (!worksheet["!ref"]) return;
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    const cell = worksheet[cellAddress];
    if (!cell) continue;
    cell.s = HEADER_STYLE;
  }
}

function buildWorksheet(plan) {
  const ws = XLSX.utils.json_to_sheet(buildRows(plan));
  ws["!cols"] = COLUMN_WIDTHS;
  styleHeaderRow(ws);
  return ws;
}

function sanitizeForFilename(value) {
  const cleaned = value.replace(/[^\w-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned || "plan";
}

function sanitizeSheetName(value) {
  return value.replace(/[[\]:*?/\\]/g, "_").slice(0, 31) || "Sheet";
}

function uniqueSheetName(base, used) {
  let name = sanitizeSheetName(base);
  let n = 1;
  while (used.has(name)) {
    n++;
    const suffix = ` (${n})`;
    name = sanitizeSheetName(base.slice(0, 31 - suffix.length) + suffix);
  }
  used.add(name);
  return name;
}

// Same download approach as utils/parse.js — no extra dependency needed.
function writeAndSave(workbook, filename) {
  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true,
  });
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDayPlanToExcel(plan) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildWorksheet(plan), "Day Plan");
  writeAndSave(
    workbook,
    `DayPlan_${sanitizeForFilename(plan.city)}_${plan.date}.xlsx`,
  );
}

export function exportAllDayPlansToExcel(plans) {
  if (plans.length === 0) return;

  const workbook = XLSX.utils.book_new();
  const used = new Set();

  for (const plan of plans) {
    const name = uniqueSheetName(`${plan.city}_${plan.date}`, used);
    XLSX.utils.book_append_sheet(workbook, buildWorksheet(plan), name);
  }

  const today = new Date().toISOString().slice(0, 10);
  writeAndSave(workbook, `AllDayPlans_${today}.xlsx`);
}

export function exportZonesToExcel(savedGeofences, allSites) {
  if (savedGeofences.length === 0) return;

  const workbook = XLSX.utils.book_new();

  // Sheet 1: one row per saved zone.
  const summarySheet = XLSX.utils.json_to_sheet(
    savedGeofences.map((z) => ({
      Zone_Name: z.name,
      City: z.city,
      Sites_Count: z.siteCount,
      Created: z.createdAt,
      Color: z.color,
    })),
  );
  summarySheet["!cols"] = [
    { wch: 28 },
    { wch: 16 },
    { wch: 12 },
    { wch: 24 },
    { wch: 10 },
  ];
  styleHeaderRow(summarySheet);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Zones Summary");

  // One sheet per zone, listing the sites currently inside its boundary.
  const used = new Set(["Zones Summary"]);
  for (const zone of savedGeofences) {
    const sheet = XLSX.utils.json_to_sheet(
      getSitesInPath(allSites, zone.coordinates).map((site, i) => ({
        Stop: i + 1,
        Site_Name: site.name,
        Site_ID: site.siteId ?? "",
        City: site.city,
        Latitude: site.lat,
        Longitude: site.lng,
        Type: site.type ?? "",
        Priority: site.priority ?? "",
        Status: site.status,
        Zone: zone.name,
      })),
    );
    sheet["!cols"] = [
      { wch: 6 },
      { wch: 32 },
      { wch: 16 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 },
      { wch: 10 },
      { wch: 12 },
      { wch: 24 },
    ];
    styleHeaderRow(sheet);
    XLSX.utils.book_append_sheet(
      workbook,
      sheet,
      uniqueSheetName(zone.name, used),
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  writeAndSave(workbook, `SmartLife_Zones_${today}.xlsx`);
}
