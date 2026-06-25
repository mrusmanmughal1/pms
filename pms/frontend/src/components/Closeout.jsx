export default function Closeout({
  project,
  editMode,
  setForm,
  form,
  getWoStatusColor,
}) {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", width: "100%" }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>
        4 Closeout
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* 4.1 PAT TCN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 2fr",
            gap: "1rem",
            alignItems: "start",
          }}
        >
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              4.1 PAT TCN
            </label>
            {editMode ? (
              <input
                type="text"
                className="form-input"
                placeholder="PAT TCN Number"
                value={form.closeout?.patTcn?.number || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      patTcn: {
                        ...form.closeout?.patTcn,
                        number: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.closeout?.patTcn?.number || "—"}
              </div>
            )}
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Status
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.closeout?.patTcn?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      patTcn: {
                        ...form.closeout?.patTcn,
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
                className={`pill-${(project.closeout?.patTcn?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.closeout?.patTcn?.status,
                    ),
                  }}
                >
                  {project.closeout?.patTcn?.status || "Pending"}
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
                value={form.closeout?.patTcn?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      patTcn: {
                        ...form.closeout?.patTcn,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.closeout?.patTcn?.date
                  ? new Date(
                      project.closeout.patTcn.date,
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
                value={form.closeout?.patTcn?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      patTcn: {
                        ...form.closeout?.patTcn,
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
                {project.closeout?.patTcn?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* 4.2 PAT status */}
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
              4.2 PAT status
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.closeout?.patStatus?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      patStatus: {
                        ...form.closeout?.patStatus,
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
                className={`pill-${(project.closeout?.patStatus?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.closeout?.patStatus?.status,
                    ),
                  }}
                >
                  {project.closeout?.patStatus?.status || "Pending"}
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
                value={form.closeout?.patStatus?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      patStatus: {
                        ...form.closeout?.patStatus,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.closeout?.patStatus?.date
                  ? new Date(
                      project.closeout.patStatus.date,
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
                value={form.closeout?.patStatus?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      patStatus: {
                        ...form.closeout?.patStatus,
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
                {project.closeout?.patStatus?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* 4.3 Invoicing */}
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
              4.3 Invoicing
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.closeout?.invoicing?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      invoicing: {
                        ...form.closeout?.invoicing,
                        status: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>N/A</option>
              </select>
            ) : (
              <div
                className={`pill-${(project.closeout?.invoicing?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.closeout?.invoicing?.status,
                    ),
                  }}
                >
                  {project.closeout?.invoicing?.status || "Pending"}
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
                value={form.closeout?.invoicing?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      invoicing: {
                        ...form.closeout?.invoicing,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.closeout?.invoicing?.date
                  ? new Date(
                      project.closeout.invoicing.date,
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
                value={form.closeout?.invoicing?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      invoicing: {
                        ...form.closeout?.invoicing,
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
                {project.closeout?.invoicing?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* 4.4 Capitalisation Sheet update */}
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
              4.4 Capitalisation Sheet update
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.closeout?.capitalisationSheetUpdate?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      capitalisationSheetUpdate: {
                        ...form.closeout?.capitalisationSheetUpdate,
                        status: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>N/A</option>
              </select>
            ) : (
              <div
                className={`pill-${(project.closeout?.capitalisationSheetUpdate?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.closeout?.capitalisationSheetUpdate?.status,
                    ),
                  }}
                >
                  {project.closeout?.capitalisationSheetUpdate?.status || "Pending"}
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
                value={form.closeout?.capitalisationSheetUpdate?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      capitalisationSheetUpdate: {
                        ...form.closeout?.capitalisationSheetUpdate,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.closeout?.capitalisationSheetUpdate?.date
                  ? new Date(
                      project.closeout.capitalisationSheetUpdate.date,
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
                value={form.closeout?.capitalisationSheetUpdate?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    closeout: {
                      ...form.closeout,
                      capitalisationSheetUpdate: {
                        ...form.closeout?.capitalisationSheetUpdate,
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
                {project.closeout?.capitalisationSheetUpdate?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* General Remarks */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
          <label className="form-label" style={{ fontWeight: 600 }}>
            ( Remarks )
          </label>
          {editMode ? (
            <textarea
              className="form-textarea"
              rows={2}
              value={form.closeout?.generalRemarks || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  closeout: {
                    ...form.closeout,
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
              {project.closeout?.generalRemarks || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
