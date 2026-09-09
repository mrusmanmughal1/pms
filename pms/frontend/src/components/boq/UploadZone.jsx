import { useRef, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";

export default function UploadZone({ onFile, loading }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) return;
    onFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !loading && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!loading && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      className={`upload-zone upload-zone-lg${dragging ? " dragging" : ""}${
        loading ? " loading" : ""
      }`}
    >
      <div className="upload-zone-icon">
        {loading ? (
          <span className="tool-spinner" />
        ) : dragging ? (
          <Upload size={26} />
        ) : (
          <FileSpreadsheet size={26} />
        )}
      </div>

      <p className="upload-zone-title">
        {loading ? "Reading workbook…" : "Drop your Excel file here"}
      </p>
      <p className="upload-zone-hint">
        {loading
          ? "Analysing the sheet structure"
          : "or click to browse — .xlsx or .xls"}
      </p>

      <div className="upload-zone-tags">
        <span className="badge-outline">Sheet 1: site data</span>
        <span className="tool-muted">+</span>
        <span className="badge-outline">Sheet 2: categories</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
