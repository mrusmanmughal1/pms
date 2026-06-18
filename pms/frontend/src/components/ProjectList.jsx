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
  const {
    data: projects,
    isLoading,
    error,
  } = useProjectsByCategory(categoryName);



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
          Showing &nbsp;
          <span style={{ color: getCategoryColor(categoryName), fontSize: "1.25rem", fontWeight: "600", textTransform: "capitalize" }}>
            {categoryName}
          </span>{" "}
          Projects
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

      <ProjectForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategory={categoryName}
      />
    </div>
  );
};

export default ProjectList;
