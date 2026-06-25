import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "../service/index";
import {
  useDeleteProject,
  useProjectById,
  useUpdateProject,
} from "../hooks/project";
import ConfirmModal from "../components/ConfirmModal";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useAuthStore } from "../store/authStore";
import { getCatBadge } from "../utils/helpers";
import { Calendar, SaudiRiyal, Users2 } from "lucide-react";
import { getWoStatusColor } from "../utils/statusColor";
import MapData from "../components/MapData";
import WorkOrder from "../components/WorkOrder";
import Installation from "../components/Installation";
import Integration from "../components/Integration";
import Closeout from "../components/Closeout";
import ProgressBar from "../components/ProgressBar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: project, isLoading, isError } = useProjectById(id);
  console.log(project);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    mapping: { woRequest: {}, woIssuance: {}, materialsRequest: {} },
    installation: {
      tcnRequest: {},
      teamsMaterialsMobilization: {},
      tcnApproval: {},
      siteInstallation: {},
    },
    integration: {
      alarmsConfiguration: {},
      annexNumber: {},
      tenantsIntegration: {},
    },
    closeout: {
      patTcn: {},
      patStatus: {},
      invoicing: {},
      capitalisationSheetUpdate: {},
    },
  });
  const [saving, setSaving] = useState(false);
  const deleteMutation = useDeleteProject();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiInstance.get(`${API_BASE}/users`).then((r) => r.data),
  });
  const updateMutation = useUpdateProject();
  React.useEffect(() => {
    if (project)
      setForm({
        title: project.title || "",
        description: project.description || "",
        status: project.status || "Planning",
        priority: project.priority || "Low",
        progress: project.progress || 0,
        budget: project.budget || 0,
        spent: project.spent || 0,
        teamLead: project.teamLead || "",
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().slice(0, 10)
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().slice(0, 10)
          : "",
        longitude: project.longitude ?? "",
        latitude: project.latitude ?? "",
        tags: (project.tags || []).join(", "),
        mapping: {
          woRequest: {
            status: project.mapping?.woRequest?.status || "Pending",
            date: project.mapping?.woRequest?.date
              ? new Date(project.mapping.woRequest.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.mapping?.woRequest?.remarks || "",
          },
          woIssuance: {
            status: project.mapping?.woIssuance?.status || "Pending",
            date: project.mapping?.woIssuance?.date
              ? new Date(project.mapping.woIssuance.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.mapping?.woIssuance?.remarks || "",
          },
          materialsRequest: {
            status: project.mapping?.materialsRequest?.status || "Pending",
            date: project.mapping?.materialsRequest?.date
              ? new Date(project.mapping.materialsRequest.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.mapping?.materialsRequest?.remarks || "",
          },
          generalRemarks: project.mapping?.generalRemarks || "",
        },
        installation: {
          tcnRequest: {
            tcnNumber: project.installation?.tcnRequest?.tcnNumber || "",
            status: project.installation?.tcnRequest?.status || "Pending",
            date: project.installation?.tcnRequest?.date
              ? new Date(project.installation.tcnRequest.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.installation?.tcnRequest?.remarks || "",
          },
          teamsMaterialsMobilization: {
            status:
              project.installation?.teamsMaterialsMobilization?.status ||
              "Pending",
            date: project.installation?.teamsMaterialsMobilization?.date
              ? new Date(project.installation.teamsMaterialsMobilization.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks:
              project.installation?.teamsMaterialsMobilization?.remarks || "",
          },
          tcnApproval: {
            status: project.installation?.tcnApproval?.status || "Pending",
            date: project.installation?.tcnApproval?.date
              ? new Date(project.installation.tcnApproval.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.installation?.tcnApproval?.remarks || "",
          },
          siteInstallation: {
            type: project.installation?.siteInstallation?.type || "RMS",
            status: project.installation?.siteInstallation?.status || "Pending",
            date: project.installation?.siteInstallation?.date
              ? new Date(project.installation.siteInstallation.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.installation?.siteInstallation?.remarks || "",
          },
          generalRemarks: project.installation?.generalRemarks || "",
        },
        integration: {
          alarmsConfiguration: {
            status:
              project.integration?.alarmsConfiguration?.status || "Pending",
            date: project.integration?.alarmsConfiguration?.date
              ? new Date(project.integration.alarmsConfiguration.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.integration?.alarmsConfiguration?.remarks || "",
          },
          annexNumber: {
            number: project.integration?.annexNumber?.number || "",
            status: project.integration?.annexNumber?.status || "Pending",
            date: project.integration?.annexNumber?.date
              ? new Date(project.integration.annexNumber.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.integration?.annexNumber?.remarks || "",
          },
          tenantsIntegration: {
            status:
              project.integration?.tenantsIntegration?.status || "Pending",
            date: project.integration?.tenantsIntegration?.date
              ? new Date(project.integration.tenantsIntegration.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.integration?.tenantsIntegration?.remarks || "",
          },
          generalRemarks: project.integration?.generalRemarks || "",
        },
        closeout: {
          patTcn: {
            number: project.closeout?.patTcn?.number || "",
            status: project.closeout?.patTcn?.status || "Pending",
            date: project.closeout?.patTcn?.date
              ? new Date(project.closeout.patTcn.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.closeout?.patTcn?.remarks || "",
          },
          patStatus: {
            status: project.closeout?.patStatus?.status || "Pending",
            date: project.closeout?.patStatus?.date
              ? new Date(project.closeout.patStatus.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.closeout?.patStatus?.remarks || "",
          },
          invoicing: {
            status: project.closeout?.invoicing?.status || "Pending",
            date: project.closeout?.invoicing?.date
              ? new Date(project.closeout.invoicing.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.closeout?.invoicing?.remarks || "",
          },
          capitalisationSheetUpdate: {
            status:
              project.closeout?.capitalisationSheetUpdate?.status || "Pending",
            date: project.closeout?.capitalisationSheetUpdate?.date
              ? new Date(project.closeout.capitalisationSheetUpdate.date)
                  .toISOString()
                  .slice(0, 10)
              : "",
            remarks: project.closeout?.capitalisationSheetUpdate?.remarks || "",
          },
          generalRemarks: project.closeout?.generalRemarks || "",
        },
      });
  }, [project]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Ensure tags are sent as an array and dates are preserved
      const payload = {
        ...form,
        tags:
          typeof form.tags === "string"
            ? form.tags
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : form.tags,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        longitude: form.longitude === "" ? undefined : Number(form.longitude),
        latitude: form.latitude === "" ? undefined : Number(form.latitude),
        mapping: {
          ...form.mapping,
          woRequest: {
            ...form.mapping?.woRequest,
            date: form.mapping?.woRequest?.date || null,
          },
          woIssuance: {
            ...form.mapping?.woIssuance,
            date: form.mapping?.woIssuance?.date || null,
          },
          materialsRequest: {
            ...form.mapping?.materialsRequest,
            date: form.mapping?.materialsRequest?.date || null,
          },
        },
        installation: {
          ...form.installation,
          tcnRequest: {
            ...form.installation?.tcnRequest,
            date: form.installation?.tcnRequest?.date || null,
          },
          teamsMaterialsMobilization: {
            ...form.installation?.teamsMaterialsMobilization,
            date: form.installation?.teamsMaterialsMobilization?.date || null,
          },
          tcnApproval: {
            ...form.installation?.tcnApproval,
            date: form.installation?.tcnApproval?.date || null,
          },
          siteInstallation: {
            ...form.installation?.siteInstallation,
            date: form.installation?.siteInstallation?.date || null,
          },
        },
        integration: {
          ...form.integration,
          alarmsConfiguration: {
            ...form.integration?.alarmsConfiguration,
            date: form.integration?.alarmsConfiguration?.date || null,
          },
          annexNumber: {
            ...form.integration?.annexNumber,
            date: form.integration?.annexNumber?.date || null,
          },
          tenantsIntegration: {
            ...form.integration?.tenantsIntegration,
            date: form.integration?.tenantsIntegration?.date || null,
          },
        },
        closeout: {
          ...form.closeout,
          patTcn: {
            ...form.closeout?.patTcn,
            date: form.closeout?.patTcn?.date || null,
          },
          patStatus: {
            ...form.closeout?.patStatus,
            date: form.closeout?.patStatus?.date || null,
          },
          invoicing: {
            ...form.closeout?.invoicing,
            date: form.closeout?.invoicing?.date || null,
          },
          capitalisationSheetUpdate: {
            ...form.closeout?.capitalisationSheetUpdate,
            date: form.closeout?.capitalisationSheetUpdate?.date || null,
          },
        },
      };
      await updateMutation.mutateAsync({ id, updates: payload });
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    // open confirmation modal
    setConfirmOpen(true);
  };

  const performDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmOpen(false);
        navigate("/projects");
      },
      onError: (err) => {
        console.error("Delete failed", err);
        setConfirmOpen(false);
      },
    });
  };

  if (isLoading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (isError || !project)
    return (
      <div style={{ padding: "2rem", color: "red" }}>Project not found.</div>
    );

  const AllowMapping =
    user.role === "Admin" || user.role === "PM" || user.role === "Logistics";

  const AllowInstallation =
    user.role === "Admin" || user.role === "PM" || user.role === "Coordinator";

  const AllowIntegration =
    user.role === "Admin" ||
    user.role === "PM" ||
    user.role === "Integration & Support";

  const AllowCloseout =
    user.role === "Admin" ||
    user.role === "PM" ||
    user.role === "Document Controller" ||
    user.role === "Closeout";

  return (
    <div className="">
      <div
        className="glass-panel"
        style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: "1.25rem",
                textTransform: "capitalize",
              }}
            >
              {/* add project icon  */}
              {project.title}{" "}
              <span
                className={`badge ${getCatBadge(project.category)}`}
                style={{ marginRight: "0.5rem" }}
              >
                {project.category}
              </span>
            </h2>
            <div
              style={{
                color: "black",
                marginTop: "0.35rem",
                fontSize: "0.9rem",
              }}
            >
              Allocated Budget : <SaudiRiyal size={12} />{" "}
              {project.budget?.toLocaleString() ?? 0}
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                marginTop: "0.35rem",
                fontSize: "0.875rem",
              }}
            >
              <Calendar size={14} /> Created :{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                marginTop: "0.35rem",
                fontSize: "0.875rem",
              }}
            >
              <Users2 size={14} /> Team Members :{" "}
              {project.teamMembers.join(", ")}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(user?.role === "Admin" || user?.role === "Manager") && (
              <>
                {editMode ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setEditMode(false);
                        setForm({
                          title: project.title || "",
                          description: project.description || "",
                          status: project.status || "Planning",
                          priority: project.priority || "Low",
                          progress: project.progress || 0,
                          budget: project.budget || 0,
                          spent: project.spent || 0,
                          teamLead: project.teamLead || "",
                          startDate: project.startDate
                            ? new Date(project.startDate)
                                .toISOString()
                                .slice(0, 10)
                            : "",
                          endDate: project.endDate
                            ? new Date(project.endDate)
                                .toISOString()
                                .slice(0, 10)
                            : "",
                          longitude: project.longitude ?? "",
                          latitude: project.latitude ?? "",
                          tags: (project.tags || []).join(", "),
                          mapping: {
                            woRequest: {
                              status:
                                project.mapping?.woRequest?.status || "Pending",
                              date: project.mapping?.woRequest?.date
                                ? new Date(project.mapping.woRequest.date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.mapping?.woRequest?.remarks || "",
                            },
                            woIssuance: {
                              status:
                                project.mapping?.woIssuance?.status ||
                                "Pending",
                              date: project.mapping?.woIssuance?.date
                                ? new Date(project.mapping.woIssuance.date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.mapping?.woIssuance?.remarks || "",
                            },
                            materialsRequest: {
                              status:
                                project.mapping?.materialsRequest?.status ||
                                "Pending",
                              date: project.mapping?.materialsRequest?.date
                                ? new Date(
                                    project.mapping.materialsRequest.date,
                                  )
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.mapping?.materialsRequest?.remarks ||
                                "",
                            },
                            generalRemarks:
                              project.mapping?.generalRemarks || "",
                          },
                          installation: {
                            tcnRequest: {
                              tcnNumber:
                                project.installation?.tcnRequest?.tcnNumber ||
                                "",
                              status:
                                project.installation?.tcnRequest?.status ||
                                "Pending",
                              date: project.installation?.tcnRequest?.date
                                ? new Date(project.installation.tcnRequest.date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.installation?.tcnRequest?.remarks || "",
                            },
                            teamsMaterialsMobilization: {
                              status:
                                project.installation?.teamsMaterialsMobilization
                                  ?.status || "Pending",
                              date: project.installation
                                ?.teamsMaterialsMobilization?.date
                                ? new Date(
                                    project.installation
                                      .teamsMaterialsMobilization.date,
                                  )
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.installation?.teamsMaterialsMobilization
                                  ?.remarks || "",
                            },
                            tcnApproval: {
                              status:
                                project.installation?.tcnApproval?.status ||
                                "Pending",
                              date: project.installation?.tcnApproval?.date
                                ? new Date(
                                    project.installation.tcnApproval.date,
                                  )
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.installation?.tcnApproval?.remarks ||
                                "",
                            },
                            siteInstallation: {
                              type:
                                project.installation?.siteInstallation?.type ||
                                "RMS",
                              status:
                                project.installation?.siteInstallation
                                  ?.status || "Pending",
                              date: project.installation?.siteInstallation?.date
                                ? new Date(
                                    project.installation.siteInstallation.date,
                                  )
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.installation?.siteInstallation
                                  ?.remarks || "",
                            },
                            generalRemarks:
                              project.installation?.generalRemarks || "",
                          },
                          integration: {
                            alarmsConfiguration: {
                              status:
                                project.integration?.alarmsConfiguration
                                  ?.status || "Pending",
                              date: project.integration?.alarmsConfiguration
                                ?.date
                                ? new Date(
                                    project.integration.alarmsConfiguration
                                      .date,
                                  )
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.integration?.alarmsConfiguration
                                  ?.remarks || "",
                            },
                            annexNumber: {
                              number:
                                project.integration?.annexNumber?.number || "",
                              status:
                                project.integration?.annexNumber?.status ||
                                "Pending",
                              date: project.integration?.annexNumber?.date
                                ? new Date(project.integration.annexNumber.date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.integration?.annexNumber?.remarks || "",
                            },
                            tenantsIntegration: {
                              status:
                                project.integration?.tenantsIntegration
                                  ?.status || "Pending",
                              date: project.integration?.tenantsIntegration
                                ?.date
                                ? new Date(
                                    project.integration.tenantsIntegration.date,
                                  )
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.integration?.tenantsIntegration
                                  ?.remarks || "",
                            },
                            generalRemarks:
                              project.integration?.generalRemarks || "",
                          },
                          closeout: {
                            patTcn: {
                              number: project.closeout?.patTcn?.number || "",
                              status:
                                project.closeout?.patTcn?.status || "Pending",
                              date: project.closeout?.patTcn?.date
                                ? new Date(project.closeout.patTcn.date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks: project.closeout?.patTcn?.remarks || "",
                            },
                            patStatus: {
                              status:
                                project.closeout?.patStatus?.status ||
                                "Pending",
                              date: project.closeout?.patStatus?.date
                                ? new Date(project.closeout.patStatus.date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.closeout?.patStatus?.remarks || "",
                            },
                            invoicing: {
                              status:
                                project.closeout?.invoicing?.status ||
                                "Pending",
                              date: project.closeout?.invoicing?.date
                                ? new Date(project.closeout.invoicing.date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.closeout?.invoicing?.remarks || "",
                            },
                            capitalisationSheetUpdate: {
                              status:
                                project.closeout?.capitalisationSheetUpdate
                                  ?.status || "Pending",
                              date: project.closeout?.capitalisationSheetUpdate
                                ?.date
                                ? new Date(
                                    project.closeout.capitalisationSheetUpdate
                                      .date,
                                  )
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                              remarks:
                                project.closeout?.capitalisationSheetUpdate
                                  ?.remarks || "",
                            },
                            generalRemarks:
                              project.closeout?.generalRemarks || "",
                          },
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-outline"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
            {user?.role === "Admin" && (
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
              >
                Delete
              </button>
            )}
            <ConfirmModal
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={performDelete}
              title={`Delete project: ${project.title}`}
              message={`Are you sure you want to permanently delete this project? This action cannot be undone.`}
              isLoading={deleteMutation.isLoading}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0.5rem",
        }}
      >
        <div className="glass-panel" style={{ width: "100%" }}>
          <label
            className="form-label"
            style={{ fontSize: "1rem", fontWeight: "600" }}
          >
            Description
          </label>
          {editMode ? (
            <textarea
              className="form-textarea"
              rows={20}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          ) : (
            <p
              style={{
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                width: "350px",
                overflowWrap: "break-word",
                height: "350px",
                overflowY: "auto",
                fontSize: "0.8rem",
              }}
            >
              {project.description}
            </p>
          )}
        </div>
        <div className="">
          <div className=" glass-panel" style={{ minHeight: "100%" }}>
            <label
              className="form-label"
              style={{ fontSize: "1rem", fontWeight: "600" }}
            >
              Details{" "}
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr ",
                gap: "0.4rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <label className="form-label">Team Lead</label>
                {editMode ? (
                  <>
                    {usersLoading ? (
                      <select className="form-select" disabled>
                        <option>Loading users...</option>
                      </select>
                    ) : (
                      <select
                        className="form-select"
                        value={form.teamLead}
                        onChange={(e) =>
                          setForm({ ...form, teamLead: e.target.value })
                        }
                      >
                        <option value="">— Select team lead —</option>
                        {users.map((u) => (
                          <option key={u._id} value={u.name}>
                            {u.name} {u.email ? `(${u.email})` : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                ) : (
                  <div>{project.teamLead || "—"}</div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <label className="form-label">Tags</label>
                {editMode ? (
                  <input
                    className="form-input"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="comma, separated, tags"
                  />
                ) : (
                  <div>{(project.tags || []).join(", ") || "—"}</div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "0.4rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <label className="form-label">Start Date</label>
                {editMode ? (
                  <input
                    type="date"
                    className="form-input"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                ) : (
                  <div style={{ fontSize: "0.8rem" }}>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "—"}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <label className="form-label">End Date</label>
                {editMode ? (
                  <input
                    type="date"
                    className="form-input"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                ) : (
                  <div style={{ fontSize: "0.8rem" }}>
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "—"}
                  </div>
                )}
              </div>
            </div>
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <label className="form-label">Status</label>
              {editMode ? (
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Testing</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              ) : (
                <div
                  className={`pill-${project.status.replace(/\s+/g, "").toLowerCase()}`}
                  style={{ fontSize: "0.7rem" }}
                >
                  {project.status}
                </div>
              )}
            </div>

            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <label className="form-label" style={{ fontSize: "0.8rem" }}>
                Priority
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              ) : (
                <div className="" style={{ display: "flex" }}>
                  <div
                    className={`priority-${project.priority.toLowerCase()}`}
                    style={{ fontSize: "0.8rem", padding: "1px 10px" }}
                  >
                    {project.priority}
                  </div>
                </div>
              )}
            </div>

            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginTop: "0.4rem",
              }}
            >
              <label className="form-label" style={{ fontSize: "0.8rem" }}>
                WO Request
              </label>
              <div
                className={`pill-${(project.mapping?.woRequest?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.7rem", padding: "1px 10px" }}
              >
                {project.mapping?.woRequest?.status || "Pending"}
              </div>
            </div>

            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginTop: "0.4rem",
              }}
            >
              <label className="form-label" style={{ fontSize: "0.8rem" }}>
                Issued TCN
              </label>
              <div
                className={`pill-${(project.installation?.tcnRequest?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.7rem", padding: "1px 10px" }}
              >
                {project.installation?.tcnRequest?.status || "Pending"}
              </div>
            </div>

            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginTop: "0.4rem",
              }}
            >
              <label className="form-label" style={{ fontSize: "0.8rem" }}>
                Site Installation
              </label>
              <div
                className={`pill-${(project.installation?.siteInstallation?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.7rem", padding: "1px 10px" }}
              >
                {project.installation?.siteInstallation?.status || "Pending"}
              </div>
            </div>

            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginTop: "0.4rem",
              }}
            >
              <label className="form-label" style={{ fontSize: "0.8rem" }}>
                Integration
              </label>
              <div
                className={`pill-${(project.integration?.alarmsConfiguration?.status || "pending").toLowerCase()}`}
                style={{ fontSize: "0.7rem", padding: "1px 10px" }}
              >
                {project.integration?.alarmsConfiguration?.status || "Pending"}
              </div>
            </div>
          </div>
        </div>
        <div>
          <ProgressBar
            editMode={editMode}
            form={form}
            project={project}
            setForm={setForm}
          />
          <div className="  glass-panel">
            <h3 style={{ margin: "0 0 0.5rem 0" }}>Budget & Spent</h3>

            {/* Budget vs Spent chart */}
            {(() => {
              const displayBudget = editMode
                ? Number(form.budget || 0)
                : Number(project.budget || 0);
              const displaySpent = editMode
                ? Number(form.spent || 0)
                : Number(project.spent || 0);
              const chartData = [
                { name: "Budget", value: displayBudget },
                { name: "Spent", value: displaySpent },
              ];

              return (
                <div>
                  {editMode && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div>
                        <label className="form-label">Budget</label>
                        <input
                          type="number"
                          className="form-input"
                          value={form.budget}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              budget: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="form-label">Spent</label>
                        <input
                          type="number"
                          className="form-input"
                          value={form.spent}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              spent: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ height: 140, marginBottom: "0.5rem" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                      >
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "var(--text-secondary)" }}
                        />
                        <Tooltip
                          formatter={(val) => `${Number(val).toLocaleString()}`}
                        />
                        <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                          {chartData.map((entry, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={
                                entry.name === "Spent" ? "#10b981" : "#3b82f6"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Budget
                      </div>
                      <div style={{ fontWeight: 700 }}>
                        <SaudiRiyal size={12} />{" "}
                        {displayBudget.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Spent
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color:
                            displaySpent > displayBudget
                              ? "#dc2626"
                              : "#10b981",
                        }}
                      >
                        <SaudiRiyal size={12} /> {displaySpent.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      <div className="" style={{ margin: "10px 0" }}>
        {project.latitude != null && project.longitude != null && (
          <MapData project={project} />
        )}
      </div>

      <div
        className=""
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {AllowMapping && (
          <WorkOrder
            project={project}
            editMode={editMode}
            setForm={setForm}
            form={form}
            getWoStatusColor={getWoStatusColor}
          />
        )}

        {/* admin pm and Coordinator  */}
        {AllowInstallation && (
          <Installation
            project={project}
            editMode={editMode}
            setForm={setForm}
            form={form}
            getWoStatusColor={getWoStatusColor}
          />
        )}

        {AllowIntegration && (
          <Integration
            project={project}
            editMode={editMode}
            setForm={setForm}
            form={form}
            getWoStatusColor={getWoStatusColor}
          />
        )}
        {AllowCloseout && (
          <Closeout
            project={project}
            editMode={editMode}
            setForm={setForm}
            form={form}
            getWoStatusColor={getWoStatusColor}
          />
        )}
      </div>
    </div>
  );
}
