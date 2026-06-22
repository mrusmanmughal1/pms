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
            if (h === "budget" || h === "spent" || h === "progress" || h === "longitude" || h === "latitude") {
                v = v === "" ? 0 : Number(v);
            }
            if (h === "teamMembers" || h === "tags") {
                v = v === "" ? [] : v.split(";").map((s) => s.trim()).filter(Boolean);
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