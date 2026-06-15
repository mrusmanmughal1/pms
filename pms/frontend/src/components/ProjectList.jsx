import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { useAuthStore } from "../store/authStore";
import { useProjectsByCategory } from "../hooks/project";

const ProjectList = () => {
  const { user } = useAuthStore();
  const { categoryName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: projects,
    isLoading,
    error,
  } = useProjectsByCategory(categoryName);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "RMS":
        return "var(--cat-rms)";
      case "Smart meter":
        return "var(--cat-smartmeter)";
      case "Smart Lock":
        return "var(--cat-smartlock)";
      default:
        return "var(--primary-color)";
    }
  };

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
        <h1>
          <span style={{ color: getCategoryColor(categoryName) }}>
            {categoryName}
          </span>{" "}
          Projects
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
            <div key={project._id} className="glass-panel">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ margin: 0 }}>{project.title}</h3>
                <span
                  className={`badge`}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color:
                      project.status === "Completed"
                        ? "#10b981"
                        : "var(--text-primary)",
                  }}
                >
                  {project.status}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                {project.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <small style={{ color: "var(--text-secondary)" }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </small>
                {user?.role === "Admin" && (
                  <button
                    className="btn btn-danger"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
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
