import * as XLSX from "xlsx-js-style";

const NAME_KEYS = ["name", "site", "site name", "sitename", "title"];
const CITY_KEYS = ["city", "town", "municipality"];
const LAT_KEYS = ["lat", "latitude"];
const LNG_KEYS = ["lng", "long", "longitude"];
const ADDRESS_KEYS = ["address", "addr", "location"];
const TYPE_KEYS = ["type", "category", "kind"];
const PRIORITY_KEYS = ["priority", "urgency"];
const REGION_KEYS = ["region", "area", "province", "state"];
const ID_KEYS = [
  "stc id",
  "stc_id",
  "stcid",
  "stc-id",
  "tawal id",
  "tawal_id",
  "site id",
  "site_id",
  "id",
];

function normalizePriority(value) {
  if (value == null) return undefined;
  const s = String(value).trim().toLowerCase();
  if (s === "high" || s === "h" || s === "1") return "High";
  if (s === "medium" || s === "med" || s === "m" || s === "2") return "Medium";
  if (s === "low" || s === "l" || s === "3") return "Low";
  return undefined;
}

function normalizeKey(key) {
  return key.trim().toLowerCase();
}

function buildKeyMap(row) {
  const map = new Map();
  for (const original of Object.keys(row)) {
    map.set(normalizeKey(original), original);
  }
  return map;
}

function findKey(map, candidates) {
  for (const candidate of candidates) {
    const hit = map.get(candidate);
    if (hit) return hit;
  }
  return undefined;
}

function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toText(value) {
  if (value == null) return "";
  return String(value).trim();
}

/**
 * Reads the first sheet of an .xlsx/.csv and maps each row to a site.
 * Column headers are matched case-insensitively against the alias lists
 * above, so "Latitude", "lat" and "LAT" all resolve. Rows without usable
 * coordinates are skipped.
 */
export async function parseSitesFromExcel(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  const sheet = workbook.Sheets[sheetName];
  // Read cell text as displayed (preserves leading zeros / formatting).
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });
  if (rows.length === 0) return [];

  const keyMap = buildKeyMap(rows[0]);
  const latKey = findKey(keyMap, LAT_KEYS);
  const lngKey = findKey(keyMap, LNG_KEYS);

  if (!latKey || !lngKey) {
    throw new Error("The file needs latitude and longitude columns.");
  }

  const nameKey = findKey(keyMap, NAME_KEYS);
  const cityKey = findKey(keyMap, CITY_KEYS);
  const addressKey = findKey(keyMap, ADDRESS_KEYS);
  const typeKey = findKey(keyMap, TYPE_KEYS);
  const priorityKey = findKey(keyMap, PRIORITY_KEYS);
  const regionKey = findKey(keyMap, REGION_KEYS);
  const idKey = findKey(keyMap, ID_KEYS);

  const sites = [];
  for (const row of rows) {
    const lat = toNumber(row[latKey]);
    const lng = toNumber(row[lngKey]);
    if (lat == null || lng == null) continue;

    const name = nameKey ? toText(row[nameKey]) : "";
    const siteId = idKey ? toText(row[idKey]) : "";

    sites.push({
      id: crypto.randomUUID(),
      siteId: siteId || undefined,
      name: name || siteId || `Site ${sites.length + 1}`,
      city: cityKey ? toText(row[cityKey]) : "",
      lat,
      lng,
      status: "pending",
      address: addressKey ? toText(row[addressKey]) || undefined : undefined,
      type: typeKey ? toText(row[typeKey]) || undefined : undefined,
      priority: priorityKey ? normalizePriority(row[priorityKey]) : undefined,
      region: regionKey ? toText(row[regionKey]) || undefined : undefined,
    });
  }

  return sites;
}
