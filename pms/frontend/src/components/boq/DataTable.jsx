import CellBadge from "./CellBadge";

const BADGE_COLS = [
  "rms",
  "expander",
  "smart meter",
  "smart lock",
  "new smart lock cabinets",
  "category",
];

function shouldBadge(col) {
  return BADGE_COLS.some((c) => col.toLowerCase().includes(c));
}

export default function DataTable({ rows, maxRows = 50, highlightFirst }) {
  if (!rows.length) {
    return (
      <p className="tool-empty">No data to show yet.</p>
    );
  }

  const cols = Object.keys(rows[0]);
  const preview = rows.slice(0, maxRows);

  return (
    <div className="tool-table-wrap">
      <table className="tool-table">
        <thead>
          <tr>
            {cols.map((col) => (
              <th
                key={col}
                className={
                  highlightFirst && (col === "TAWAL ID" || col === "Site ID")
                    ? "highlight"
                    : undefined
                }
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((row, i) => (
            <tr key={i}>
              {cols.map((col) => (
                <td key={col}>
                  {shouldBadge(col) ? (
                    <CellBadge value={String(row[col] ?? "")} />
                  ) : (
                    <span className="cell-plain strong">
                      {String(row[col] ?? "") || "—"}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length > maxRows && (
        <div className="tool-table-foot">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}
