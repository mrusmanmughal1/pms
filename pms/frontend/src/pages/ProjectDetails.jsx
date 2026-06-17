import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "../service/index";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProject, useProjectById, useUpdateProject } from "../hooks/project";
import ConfirmModal from "../components/ConfirmModal";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";
import { useAuthStore } from "../store/authStore";
import { getCatBadge } from "../utils/helpers";
import { Calendar } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

   const { data: project, isLoading, isError } = useProjectById(id);

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const queryClient = useQueryClient();
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
                startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : "",
                endDate: project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : "",
                tags: (project.tags || []).join(", "),
            });
    }, [project]);

    const handleSave = async () => {
        try {
            setSaving(true);
            // Ensure tags are sent as an array and dates are preserved
            const payload = {
                ...form,
                tags: typeof form.tags === "string" ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : form.tags,
                startDate: form.startDate || null,
                endDate: form.endDate || null,
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

    return (
        <div className="">
            <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>
                            {/* add project icon  */}
                            {project.title} <span className={`badge ${getCatBadge(project.category)}`} style={{ marginRight: "0.5rem" }}>{project.category}</span></h2>
                        <div style={{ color: "var(--text-secondary)", marginTop: "0.35rem", fontSize: "0.875rem" }}>


                            <Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {user?.role === "Admin" && (
                            <>
                                {editMode ? (
                                    <>
                                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                            Save
                                        </button>
                                        <button className="btn btn-outline" onClick={() => {
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
                                                startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : "",
                                                endDate: project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : "",
                                                tags: (project.tags || []).join(", "),
                                            });
                                        }}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-outline" onClick={() => setEditMode(true)}>
                                        Edit
                                    </button>
                                )}
                            </>
                        )}
                        {user?.role === "Admin" && (
                            <button className="btn btn-danger" onClick={handleDelete} disabled={deleteMutation.isLoading}>
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

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                <div>


                    <div className="glass-panel" style={{ padding: "1.5rem" }}>
                        <div className="form-group glass-panel">
                            <label className="form-label" style={{ fontSize: "1rem", fontWeight: "600" }}>Description</label>
                            {editMode ? (
                                <textarea className="form-textarea" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            ) : (
                                <p style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{project.description}</p>
                            )}
                        </div>

                        <div className=" glass-panel" style={{ padding: "1rem", marginTop: "1rem" }}>
                            <label className="form-label" style={{ fontSize: "1rem", fontWeight: "600" }}>Details </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                                <div>
                                        <label className="form-label">Team Lead</label>
                                        {editMode ? (
                                            <>
                                                {usersLoading ? (
                                                    <select className="form-select" disabled>
                                                        <option>Loading users...</option>
                                                    </select>
                                                ) : (
                                                    <select className="form-select" value={form.teamLead} onChange={(e) => setForm({ ...form, teamLead: e.target.value })}>
                                                        <option value="">— Select team lead —</option>
                                                        {users.map((u) => (
                                                            <option key={u._id} value={u.name}>{u.name} {u.email ? `(${u.email})` : ""}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </>
                                        ) : (
                                            <div>{project.teamLead || "—"}</div>
                                        )}
                                </div>

                                <div>
                                    <label className="form-label">Tags</label>
                                    {editMode ? (
                                        <input className="form-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="comma, separated, tags" />
                                    ) : (
                                        <div>{(project.tags || []).join(", ") || "—"}</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                                <div>
                                    <label className="form-label">Start Date</label>
                                    {editMode ? (
                                        <input type="date" className="form-input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                                    ) : (
                                        <div>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="form-label">End Date</label>
                                    {editMode ? (
                                        <input type="date" className="form-input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                                    ) : (
                                        <div>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "—"}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                            <div className="glass-panel">
                                <label className="form-label" style={{ fontSize: "1rem", fontWeight: "600" }}>Status</label>
                                {editMode ? (
                                    <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                        <option>Planning</option>
                                        <option>In Progress</option>
                                        <option>Testing</option>
                                        <option>Completed</option>
                                        <option>On Hold</option>
                                    </select>
                                ) : (
                                    <div className={`pill-${project.status.replace(/\s+/g, "").toLowerCase()}`} style={{ fontSize: "0.8rem" }} >{project.status}</div>
                                )}
                            </div>

                            <div className="glass-panel">
                                <div className="">
                                    <label className="form-label" style={{ fontSize: "1rem", fontWeight: "600" }}>Priority</label>
                                    {editMode ? (
                                        <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                            <option>Critical</option>
                                        </select>
                                    ) : (
                                        <div className="" style={{ display: "flex" }}>
                                            <div className={`priority-${project.priority.toLowerCase()}`} style={{ fontSize: "0.8rem" }} >{project.priority}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside>
                    <div className="glass-panel" style={{ padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
                        <h3 style={{ margin: "0 0 0.5rem 0" }}>Progress</h3>
                        {editMode && (
                            <div style={{ marginBottom: "0.5rem" }}>
                                <label className="form-label">Progress (%)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={form.progress}
                                    onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                                    style={{ width: "100%", marginBottom: "0.5rem" }}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="form-input"
                                    value={form.progress}
                                    onChange={(e) => setForm({ ...form, progress: Math.min(100, Math.max(0, Number(e.target.value))) })}
                                />
                            </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{editMode ? form.progress : project.progress}%</div>
                            <div style={{ flex: 1 }}>
                                <div className="progress-bg">
                                    <div className="progress-fill" style={{ width: `${editMode ? form.progress : project.progress}%`, background: (editMode ? form.progress : project.progress) >= 100 ? "var(--status-completed)" : "var(--status-inprogress)" }} />
                                </div>
                            </div>
                        </div>
                        {/* Budget vs Spent chart */}
                        {(() => {
                            const displayBudget = editMode ? Number(form.budget || 0) : Number(project.budget || 0);
                            const displaySpent = editMode ? Number(form.spent || 0) : Number(project.spent || 0);
                            const chartData = [
                                { name: "Budget", value: displayBudget },
                                { name: "Spent", value: displaySpent },
                            ];

                            return (
                                <div>
                                    {editMode && (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                            <div>
                                                <label className="form-label">Budget</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={form.budget}
                                                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Spent</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={form.spent}
                                                    onChange={(e) => setForm({ ...form, spent: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ height: 140, marginBottom: "0.5rem" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                                                <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)" }} />
                                                <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                                                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                                                    {chartData.map((entry, idx) => (
                                                        <Cell key={`cell-${idx}`} fill={entry.name === "Spent" ? "#10b981" : "#3b82f6"} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                        <div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Budget</div>
                                            <div style={{ fontWeight: 700 }}>${displayBudget.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Spent</div>
                                            <div style={{ fontWeight: 700, color: displaySpent > displayBudget ? "#dc2626" : "#10b981" }}>${displaySpent.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
                        <h4 style={{ margin: "0 0 0.5rem 0" }}>Details</h4>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                            <div style={{ marginBottom: "0.5rem" }}><strong>Team Lead: </strong>{project.teamLead || "—"}</div>
                            <div style={{ marginBottom: "0.5rem" }}><strong>Start: </strong>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</div>
                            <div style={{ marginBottom: "0.5rem" }}><strong>End: </strong>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "—"}</div>
                            <div style={{ marginTop: "0.75rem" }}>
                                <strong>Tags: </strong>{(project.tags || []).join(", ") || "—"}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
