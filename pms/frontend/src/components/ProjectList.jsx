import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { useAuthStore } from "../store/authStore";
import { useProjectsByCategory } from "../hooks/project";
import { getCategoryColor } from "../utils/helpers";
import ProjectCard from "./ProjectCard";

const ProjectList = () => {
  const { user } = useAuthStore();
  const { categoryName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const {
    data: responseData,
    isLoading,
    error,
  } = useProjectsByCategory(categoryName, { page, limit: LIMIT });

  const projects = responseData?.data || [];
  const totalPages = responseData?.meta?.totalPages || 1;
  const total = responseData?.meta?.total || 0;

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
        <p>
          Showing&nbsp;
          <span
            style={{
              color: getCategoryColor(categoryName),
              fontSize: "1.25rem",
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {categoryName}
          </span>{" "}
          Projects{total > 0 && <span style={{ fontSize: "0.875rem", color: "#64748b", marginLeft: "0.5rem" }}>({total} total)</span>}
        </p>

        {(user?.role === "Admin" || user?.role === "Manager") && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + New Project
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Loading...</div>
      ) : projects.length === 0 ? (
        <div
          className="glass-panel"
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <p>No projects found in this category.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project._id} proj={project} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--surface-border)",
          }}
        >
          <button
            className="btn btn-outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: "0.4rem 1rem", fontSize: "0.875rem" }}
          >
            ← Previous
          </button>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              fontWeight: "600",
            }}
          >
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: "0.4rem 1rem", fontSize: "0.875rem" }}
          >
            Next →
          </button>
        </div>
      )}

      <ProjectForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategory={categoryName}
      />
    </div>
  );
};

export default ProjectList;
