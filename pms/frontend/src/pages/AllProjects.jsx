import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useProjectsHook, useCategories } from "../hooks/project";
import ProjectForm from "../components/ProjectForm";
import { formatDate } from "../utils/date";
import { Calendar, FolderOpen } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { getCatBadge, getPriorityBadge } from "../utils/helpers";

const AllProjects = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projects = [], isLoading, error } = useProjectsHook();
  const { data: categories = [] } = useCategories();
  
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  const filteredProjects = projects.filter((proj) => {
    const matchCat = categoryFilter === "All Categories" || proj.category === categoryFilter;
    const matchStatus = statusFilter === "All Statuses" || proj.status === statusFilter;
    const matchPriority = priorityFilter === "All Priorities" || proj.priority === priorityFilter;
    return matchCat && matchStatus && matchPriority;
  });

  

 

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>
    );
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
        {(user?.role === "Admin" || user?.role === "Manager") && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + New Project
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: "0.5rem 1rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", background: "white", outline: "none", cursor: "pointer", minWidth: "150px" }}
        >
          <option value="All Categories">All Categories</option>
          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "0.5rem 1rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", background: "white", outline: "none", cursor: "pointer", minWidth: "150px" }}
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
          style={{ padding: "0.5rem 1rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", background: "white", outline: "none", cursor: "pointer", minWidth: "150px" }}
        >
          <option value="All Priorities">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#64748b" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
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
