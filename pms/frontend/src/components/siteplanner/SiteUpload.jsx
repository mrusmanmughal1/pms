import { useCallback, useMemo, useRef, useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { parseSitesFromExcel } from "../../utils/siteExcel";
import { useSiteStore } from "../../store/siteStore";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];
const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.join(",");

function hasAcceptedExtension(name) {
  const lower = name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export default function SiteUpload({ large = false }) {
  const setSites = useSiteStore((s) => s.setSites);
  const clearSites = useSiteStore((s) => s.clearSites);
  const sites = useSiteStore((s) => s.sites);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);
  const [lastFileName, setLastFileName] = useState(null);

  const cityCount = useMemo(() => {
    const set = new Set();
    for (const s of sites) if (s.city) set.add(s.city);
    return set.size;
  }, [sites]);

  const handleFile = useCallback(
    async (file) => {
      setError(null);
      if (!hasAcceptedExtension(file.name)) {
        setError("Unsupported file type. Upload a .xlsx, .xls or .csv file.");
        return;
      }
      setIsParsing(true);
      try {
        const parsed = await parseSitesFromExcel(file);
        setSites(parsed);
        setLastFileName(file.name);
        if (parsed.length === 0) {
          setError("No rows with valid coordinates were found in the file.");
        } else {
          toast.success(`Loaded ${parsed.length} sites`);
        }
      } catch (err) {
        setError(err?.message || "Could not read the file.");
      } finally {
        setIsParsing(false);
      }
    },
    [setSites],
  );

  const openPicker = () => inputRef.current?.click();
  const showSummary = !isParsing && !error && sites.length > 0;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem" }}>
      <div className="flex-between" style={{ marginBottom: "0.75rem" }}>
        <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Site list</h4>
        {sites.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearSites();
              setLastFileName(null);
              setError(null);
            }}
            className="tool-link-btn"
          >
            <RotateCcw size={13} />
            Start over
          </button>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className={`upload-zone${isDragging ? " dragging" : ""}${
          large ? " upload-zone-lg" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />

        <div className="upload-zone-icon">
          {isParsing ? (
            <span className="tool-spinner" />
          ) : (
            <Upload size={large ? 26 : 20} />
          )}
        </div>

        <p className="upload-zone-title">
          {isParsing
            ? "Reading file…"
            : isDragging
              ? "Drop to upload"
              : "Drag and drop your site list"}
        </p>
        <p className="upload-zone-hint">
          or click to browse — .xlsx, .xls or .csv with latitude and longitude
        </p>
      </div>

      {error && (
        <div className="tool-alert tool-alert-danger">
          <AlertCircle size={16} />
          <p style={{ margin: 0, color: "inherit" }}>{error}</p>
        </div>
      )}

      {showSummary && (
        <div className="tool-alert tool-alert-success">
          <FileSpreadsheet size={16} />
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: "inherit" }}>
              {sites.length} site{sites.length === 1 ? "" : "s"} across{" "}
              {cityCount} {cityCount === 1 ? "city" : "cities"}
            </p>
            {lastFileName && (
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  opacity: 0.8,
                  color: "inherit",
                }}
              >
                {lastFileName}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
