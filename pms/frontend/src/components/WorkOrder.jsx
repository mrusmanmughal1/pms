export default function WorkOrder({
  project,
  editMode,
  setForm,
  form,
  getWoStatusColor,
}) {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", width: "100%" }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>
        Mapping & Approvals
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* WO Request */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 2fr",
            gap: "1rem",
            alignItems: "start",
          }}
        >
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              WO Request
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.mapping?.woRequest?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      woRequest: {
                        ...form.mapping?.woRequest,
                        status: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>N/A</option>
              </select>
            ) : (
              <div
                className={`pill-${(project.mapping?.woRequest?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.mapping?.woRequest?.status,
                    ),
                  }}
                >
                  {project.mapping?.woRequest?.status || "Pending"}
                </span>{" "}
              </div>
            )}
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Date
            </label>
            {editMode ? (
              <input
                type="date"
                className="form-input"
                value={form.mapping?.woRequest?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      woRequest: {
                        ...form.mapping?.woRequest,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.mapping?.woRequest?.date
                  ? new Date(
                      project.mapping.woRequest.date,
                    ).toLocaleDateString()
                  : "—"}
              </div>
            )}
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Remarks
            </label>
            {editMode ? (
              <input
                type="text"
                className="form-input"
                placeholder="Remarks..."
                value={form.mapping?.woRequest?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      woRequest: {
                        ...form.mapping?.woRequest,
                        remarks: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                {project.mapping?.woRequest?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* WO Issuance */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 2fr",
            gap: "1rem",
            alignItems: "start",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem",
          }}
        >
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              WO Issuance
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.mapping?.woIssuance?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      woIssuance: {
                        ...form.mapping?.woIssuance,
                        status: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>N/A</option>
              </select>
            ) : (
              <div
                className={`pill-${(project.mapping?.woIssuance?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.mapping?.woRequest?.status,
                    ),
                  }}
                >
                  {project.mapping?.woRequest?.status || "Pending"}
                </span>{" "}
              </div>
            )}
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Date
            </label>
            {editMode ? (
              <input
                type="date"
                className="form-input"
                value={form.mapping?.woIssuance?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      woIssuance: {
                        ...form.mapping?.woIssuance,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.mapping?.woIssuance?.date
                  ? new Date(
                      project.mapping.woIssuance.date,
                    ).toLocaleDateString()
                  : "—"}
              </div>
            )}
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Remarks
            </label>
            {editMode ? (
              <input
                type="text"
                className="form-input"
                placeholder="Remarks..."
                value={form.mapping?.woIssuance?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      woIssuance: {
                        ...form.mapping?.woIssuance,
                        remarks: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                {project.mapping?.woIssuance?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* Materials Request */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 2fr",
            gap: "1rem",
            alignItems: "start",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem",
          }}
        >
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Materials Request
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.mapping?.materialsRequest?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      materialsRequest: {
                        ...form.mapping?.materialsRequest,
                        status: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>N/A</option>
              </select>
            ) : (
              <div
                className={`pill-${(project.mapping?.materialsRequest?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.mapping?.materialsRequest?.status,
                    ),
                  }}
                >
                  {project.mapping?.materialsRequest?.status || "Pending"}
                </span>{" "}
              </div>
            )}
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Date
            </label>
            {editMode ? (
              <input
                type="date"
                className="form-input"
                value={form.mapping?.materialsRequest?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      materialsRequest: {
                        ...form.mapping?.materialsRequest,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.mapping?.materialsRequest?.date
                  ? new Date(
                      project.mapping.materialsRequest.date,
                    ).toLocaleDateString()
                  : "—"}
              </div>
            )}
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Remarks
            </label>
            {editMode ? (
              <input
                type="text"
                className="form-input"
                placeholder="Remarks..."
                value={form.mapping?.materialsRequest?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mapping: {
                      ...form.mapping,
                      materialsRequest: {
                        ...form.mapping?.materialsRequest,
                        remarks: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                }}
              >
                {project.mapping?.materialsRequest?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* General Remarks */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
          <label className="form-label" style={{ fontWeight: 600 }}>
            General Remarks
          </label>
          {editMode ? (
            <textarea
              className="form-textarea"
              rows={2}
              value={form.mapping?.generalRemarks || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  mapping: {
                    ...form.mapping,
                    generalRemarks: e.target.value,
                  },
                })
              }
            ></textarea>
          ) : (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {project.mapping?.generalRemarks || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
