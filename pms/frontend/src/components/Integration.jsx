export default function Integration({
  project,
  editMode,
  setForm,
  form,
  getWoStatusColor,
}) {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", width: "100%" }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>
        3 Integration
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* 3.1 Alarms configuration & Integration */}
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
              3.1 Alarms configuration & Integration
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.integration?.alarmsConfiguration?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      alarmsConfiguration: {
                        ...form.integration?.alarmsConfiguration,
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
                className={`pill-${(project.integration?.alarmsConfiguration?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.integration?.alarmsConfiguration?.status,
                    ),
                  }}
                >
                  {project.integration?.alarmsConfiguration?.status || "Pending"}
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
                value={form.integration?.alarmsConfiguration?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      alarmsConfiguration: {
                        ...form.integration?.alarmsConfiguration,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.integration?.alarmsConfiguration?.date
                  ? new Date(
                      project.integration.alarmsConfiguration.date,
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
                value={form.integration?.alarmsConfiguration?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      alarmsConfiguration: {
                        ...form.integration?.alarmsConfiguration,
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
                {project.integration?.alarmsConfiguration?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* 3.2 Annex Number */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 2fr",
            gap: "1rem",
            alignItems: "start",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem",
          }}
        >
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              3.2 Annex Number
            </label>
            {editMode ? (
              <input
                type="text"
                className="form-input"
                placeholder="Annex Number"
                value={form.integration?.annexNumber?.number || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      annexNumber: {
                        ...form.integration?.annexNumber,
                        number: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.integration?.annexNumber?.number || "—"}
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
                value={form.integration?.annexNumber?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      annexNumber: {
                        ...form.integration?.annexNumber,
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
                className={`pill-${(project.integration?.annexNumber?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.integration?.annexNumber?.status,
                    ),
                  }}
                >
                  {project.integration?.annexNumber?.status || "Pending"}
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
                value={form.integration?.annexNumber?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      annexNumber: {
                        ...form.integration?.annexNumber,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.integration?.annexNumber?.date
                  ? new Date(
                      project.integration.annexNumber.date,
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
                value={form.integration?.annexNumber?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      annexNumber: {
                        ...form.integration?.annexNumber,
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
                {project.integration?.annexNumber?.remarks || "—"}
              </div>
            )}
          </div>
        </div>

        {/* 3.3 Tenants Integration */}
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
              3.3 Tenants Integration
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.integration?.tenantsIntegration?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      tenantsIntegration: {
                        ...form.integration?.tenantsIntegration,
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
                className={`pill-${(project.integration?.tenantsIntegration?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.integration?.tenantsIntegration?.status,
                    ),
                  }}
                >
                  {project.integration?.tenantsIntegration?.status || "Pending"}
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
                value={form.integration?.tenantsIntegration?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      tenantsIntegration: {
                        ...form.integration?.tenantsIntegration,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.integration?.tenantsIntegration?.date
                  ? new Date(
                      project.integration.tenantsIntegration.date,
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
                value={form.integration?.tenantsIntegration?.remarks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    integration: {
                      ...form.integration,
                      tenantsIntegration: {
                        ...form.integration?.tenantsIntegration,
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
                {project.integration?.tenantsIntegration?.remarks || "—"}
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
              value={form.integration?.generalRemarks || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  integration: {
                    ...form.integration,
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
              {project.integration?.generalRemarks || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
