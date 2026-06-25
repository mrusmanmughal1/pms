export default function Installation({
  project,
  editMode,
  setForm,
  form,
  getWoStatusColor,
}) {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", width: "100%" }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>Installation</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* 2.1 TCN request */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            alignItems: "start",
          }}
        >
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              TCN request & Approval
            </label>
            {editMode ? (
              <input
                type="text"
                className="form-input"
                placeholder="TCN Number"
                value={form.installation?.tcnRequest?.tcnNumber || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installation: {
                      ...form.installation,
                      tcnRequest: {
                        ...form.installation?.tcnRequest,
                        tcnNumber: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.installation?.tcnRequest?.tcnNumber || "—"}
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
                value={form.installation?.tcnRequest?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installation: {
                      ...form.installation,
                      tcnRequest: {
                        ...form.installation?.tcnRequest,
                        status: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>Pending</option>
                <option>Approved</option>
              </select>
            ) : (
              <div
                className={`pill-${(project.installation?.tcnRequest?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.8rem", display: "inline-block" }}
              >
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.installation?.tcnRequest?.status,
                    ),
                  }}
                >
                  {project.installation?.tcnRequest?.status || "Pending"}
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
                value={form.installation?.tcnRequest?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installation: {
                      ...form.installation,
                      tcnRequest: {
                        ...form.installation?.tcnRequest,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.installation?.tcnRequest?.date
                  ? new Date(
                      project.installation.tcnRequest.date,
                    ).toLocaleDateString()
                  : "—"}
              </div>
            )}
          </div>
        </div>

        {/* 2.2 Teams & Materials Mobilization */}
        {project.installation?.tcnRequest?.status == "Approved" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr  ",
              gap: "1rem",
              alignItems: "start",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "1rem",
            }}
          >
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Teams & Materials Mobilization
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={
                    form.installation?.teamsMaterialsMobilization?.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      installation: {
                        ...form.installation,
                        teamsMaterialsMobilization: {
                          ...form.installation?.teamsMaterialsMobilization,
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
                  className={`pill-${(project.installation?.teamsMaterialsMobilization?.status || "pending").toLowerCase()}`}
                  style={{ fontSize: "0.8rem", display: "inline-block" }}
                >
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getWoStatusColor(
                        project.installation?.teamsMaterialsMobilization
                          ?.status,
                      ),
                    }}
                  >
                    {project.installation?.teamsMaterialsMobilization?.status ||
                      "Pending"}
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
                  value={
                    form.installation?.teamsMaterialsMobilization?.date || ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      installation: {
                        ...form.installation,
                        teamsMaterialsMobilization: {
                          ...form.installation?.teamsMaterialsMobilization,
                          date: e.target.value,
                        },
                      },
                    })
                  }
                />
              ) : (
                <div style={{ fontSize: "0.9rem" }}>
                  {project.installation?.teamsMaterialsMobilization?.date
                    ? new Date(
                        project.installation.teamsMaterialsMobilization.date,
                      ).toLocaleDateString()
                    : "—"}
                </div>
              )}
            </div>
          </div>
        )}
        {/* 2.4 Site Installation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr  ",
            gap: "1rem",
            alignItems: "start",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem",
          }}
        >
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Site Installation
            </label>
            {editMode ? (
              <select
                className="form-select"
                value={form.installation?.siteInstallation?.type || "RMS"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installation: {
                      ...form.installation,
                      siteInstallation: {
                        ...form.installation?.siteInstallation,
                        type: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>RMS</option>
                <option>Smart Lock</option>
                <option>Smart Meter</option>
                <option>Other</option>
              </select>
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.installation?.siteInstallation?.type || "RMS"}
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
                value={form.installation?.siteInstallation?.status || "Pending"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installation: {
                      ...form.installation,
                      siteInstallation: {
                        ...form.installation?.siteInstallation,
                        status: e.target.value,
                      },
                    },
                  })
                }
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            ) : (
              <div style={{ fontSize: "0.8rem", display: "inline-block" }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: getWoStatusColor(
                      project.installation?.siteInstallation?.status,
                    ),
                  }}
                >
                  {project.installation?.siteInstallation?.status || "Pending"}
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
                value={form.installation?.siteInstallation?.date || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    installation: {
                      ...form.installation,
                      siteInstallation: {
                        ...form.installation?.siteInstallation,
                        date: e.target.value,
                      },
                    },
                  })
                }
              />
            ) : (
              <div style={{ fontSize: "0.9rem" }}>
                {project.installation?.siteInstallation?.date
                  ? new Date(
                      project.installation.siteInstallation.date,
                    ).toLocaleDateString()
                  : "—"}
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
              value={form.installation?.generalRemarks || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  installation: {
                    ...form.installation,
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
              {project.installation?.generalRemarks || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
