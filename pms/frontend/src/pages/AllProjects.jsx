import React, { useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import {
  useProjectsHook,
  useCategories,
  useUploadProjectsBulk,
} from "../hooks/project";
import ProjectForm from "../components/ProjectForm";
import Spinner from "../components/Spinner";
import { formatDate } from "../utils/date";
import { FolderOpen } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { getCatBadge, getPriorityBadge } from "../utils/helpers";
import toast from "react-hot-toast";
import { parseCSV } from "../utils/parse";

const AllProjects = () => {
  const uploadProjectsData = useUploadProjectsBulk();

  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const { data: projects = [], isLoading, error } = useProjectsHook();
  const { data: categories = [] } = useCategories();

  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const filteredProjects = projects.filter((proj) => {
    const matchCat =
      categoryFilter === "All Categories" || proj.category === categoryFilter;
    const matchStatus =
      statusFilter === "All Statuses" || proj.status === statusFilter;
    const matchPriority =
      priorityFilter === "All Priorities" || proj.priority === priorityFilter;
    return matchCat && matchStatus && matchPriority;
  });

  if (isLoading) {
    return <Spinner size="lg" text="Loading projects..." />;
  }
  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: "3rem" }}>
        Failed to load projects.
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
          All Projects
        </h1>
        {(user?.role === "Admin" ||
          user?.role === "Manager" ||
          user?.role === "PM") && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              + New Project
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                try {
                  const text = await file.text();
                  const parsed = parseCSV(text);
                  if (!parsed || parsed.length === 0) {
                    toast.error("No projects found in CSV");
                    return;
                  }
                  await uploadProjectsData.mutate({ projects: parsed });
                } catch (err) {
                  const msg =
                    err?.response?.data?.message ||
                    err.message ||
                    "Failed to upload CSV";
                  toast.error(msg);
                } finally {
                  // reset input so same file can be reselected
                  e.target.value = "";
                }
              }}
            />
            <button
              className="btn btn-secondary"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              {uploadProjectsData.isLoading ? (
                <Spinner size="sm" />
              ) : (
                "Upload CSV"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.4rem",
            border: "1px solid #e2e8f0",
            background: "white",
            outline: "none",
            cursor: "pointer",
            minWidth: "150px",
          }}
        >
          <option value="All Categories">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.4rem",
            border: "1px solid #e2e8f0",
            background: "white",
            outline: "none",
            cursor: "pointer",
            minWidth: "150px",
          }}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Testing">Testing</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.4rem",
            border: "1px solid #e2e8f0",
            background: "white",
            outline: "none",
            cursor: "pointer",
            minWidth: "150px",
          }}
        >
          <option value="All Priorities">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "#64748b",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <FolderOpen size={48} color="#94a3b8" />
          </div>
          <p style={{ fontSize: "1.1rem" }}>No projects match your filters.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredProjects.map((proj, i) => (
            <ProjectCard
              key={i}
              proj={proj}
              getCatBadge={getCatBadge}
              getPriorityBadge={getPriorityBadge}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      <ProjectForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AllProjects;
