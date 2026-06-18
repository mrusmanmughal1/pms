import { useState, useMemo } from "react";
import { Save } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import {
  useCreateProject,
  useCategories,
  useProjectsByCategory,
} from "../hooks/project";
import { useUsers } from "../hooks/user";

const ProjectForm = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { mutate, isLoading, error } = useCreateProject();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: users = [], isLoading: isUsersLoading } = useUsers();
  const [validationError, setValidationError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    status: "Planning",
    priority: "Low",
    progress: 0,
    teamLead: "",
    startDate: "",
    endDate: "",
    budget: 0,
    spent: 0,
    teamMembers: [],
    tags: "",
  });

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.name === formData.category),
    [categories, formData.category],
  );

  const categoryBudget = selectedCategory?.budget || 0;

  const { data: categoryProjects = [] } = useProjectsByCategory(formData.category, {
    enabled: !!formData.category,
  });

  const existingCategoryAllocated = useMemo(
    () =>
      categoryProjects.reduce(
        (sum, project) => sum + Number(project.budget || 0),
        0,
      ),
    [categoryProjects],
  );

  const currentProjectBudget = Number(formData.budget) || 0;
  const categoryAllocated = existingCategoryAllocated + currentProjectBudget;
  const remainingCategoryBudget = Math.max(
    0,
    categoryBudget - categoryAllocated,
  );

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    const parsedBudget = Number(formData.budget) || 0;
    const parsedSpent = Number(formData.spent) || 0;

    if (selectedCategory) {
      const remainingBudget = Math.max(
        0,
        categoryBudget - existingCategoryAllocated,
      );
      if (parsedBudget > remainingBudget) {
        setValidationError(
          `Project budget cannot exceed the remaining category budget: ₡${remainingBudget.toLocaleString()}`,
        );
        return;
      }
      if (parsedSpent > parsedBudget) {
        setValidationError("Spent cannot be greater than project budget.");
        return;
      }
    }

    if (parsedSpent > parsedBudget) {
      setValidationError("Spent cannot be greater than project budget.");
      return;
    }

    const parsedData = {
      ...formData,
      budget: parsedBudget,
      spent: parsedSpent,
      categoryBudget,
      tags: formData.tags
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };

    mutate(parsedData, {
      onSuccess: () => {
        onClose();
        setFormData({
          title: "",
          category: "",
          description: "",
          status: "Planning",
          priority: "Low",
          progress: 0,
          teamLead: "",
          startDate: "",
          endDate: "",
          budget: 0,
          spent: 0,
          teamMembers: [],
          tags: "",
        });
      },
    });
  };

  const formStyles = {
    label: {
      display: "block",
      fontSize: "0.8rem",
      fontWeight: "600",
      color: "#64748b",
      marginBottom: "0.4rem",
    },
    input: {
      width: "100%",
      padding: "0.6rem",
      border: "1px solid #e2e8f0",
      borderRadius: "0.4rem",
      fontSize: "0.875rem",
      fontFamily: "inherit",
    },
    gridRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
      marginBottom: "1rem",
    },
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ overflowY: "auto", padding: "2rem 0" }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "600px",
          margin: "auto",
          padding: "0",
          overflow: "hidden",
        }}
      >
        <div
          style={{ padding: "1.5rem", maxHeight: "90vh", overflowY: "auto" }}
        >

          {user?.role === "Admin" || user?.role === "Manager" ? (
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-bold mb-8 text-center">
                New Project
              </h3>
              <div style={formStyles.gridRow}>
                <div>
                  <label style={formStyles.label}>Project Title *</label>
                  <input
                    type="text"
                    style={formStyles.input}
                    placeholder="e.g. RMS Dashboard v2"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={formStyles.label}>Category *</label>
                  <select
                    style={formStyles.input}
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    disabled={isCategoriesLoading}
                  >
                    <option value="" disabled>
                      {isCategoriesLoading ? "Loading..." : "Select category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name} — ₡{cat.budget?.toLocaleString() ?? 0}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={formStyles.label}>Description</label>
                <textarea
                  style={{
                    ...formStyles.input,
                    minHeight: "80px",
                    resize: "vertical",
                  }}
                  placeholder="Brief project description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div style={formStyles.gridRow}>
                <div>
                  <label style={formStyles.label}>Status</label>
                  <select
                    style={formStyles.input}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label style={formStyles.label}>Priority</label>
                  <select
                    style={formStyles.input}
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div style={formStyles.gridRow}>
                <div>
                  <label style={formStyles.label}>Progress (%)</label>
                  <input
                    type="number"
                    style={formStyles.input}
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={formStyles.label}>Team Lead</label>
                  <select
                    style={formStyles.input}
                    value={formData.teamLead}
                    onChange={(e) =>
                      setFormData({ ...formData, teamLead: e.target.value })
                    }
                    disabled={isUsersLoading}
                  >
                    <option value="">Select Team Lead</option>
                    {users.map((u) => (
                      <option key={u._id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={formStyles.gridRow}>
                <div>
                  <label style={formStyles.label}>Start Date</label>
                  <input
                    type="date"
                    style={formStyles.input}
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={formStyles.label}>Due Date</label>
                  <input
                    type="date"
                    style={formStyles.input}
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div style={formStyles.gridRow}>
                <div>
                  <label style={formStyles.label}>Budget (&#x20C1;)</label>
                  <input
                    type="number"
                    style={formStyles.input}
                    min="0"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label style={formStyles.label}>Spent (&#x20C1;)</label>
                  <input
                    type="number"
                    style={formStyles.input}
                    min="0"
                    placeholder="0"
                    value={formData.spent}
                    onChange={(e) =>
                      setFormData({ ...formData, spent: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="">
                {selectedCategory && formData.budget > 0 && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      color: "#cc3300",
                      fontSize: "0.9rem",
                      background: "#ffcc00",
                      padding: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <b>Category budget:</b> &#x20C1; {categoryBudget.toLocaleString()}.
                    <span>
                      {" "}
                      <b>Allocated:</b>&#x20C1; {categoryAllocated.toLocaleString()}.
                    </span>

                    <span>
                      {" "}
                      <b>Remaining:</b> &#x20C1;{remainingCategoryBudget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={formStyles.label}>
                  Team Members (Hold Ctrl/Cmd to select multiple)
                </label>
                <select
                  multiple
                  style={{ ...formStyles.input, minHeight: "80px" }}
                  value={formData.teamMembers}
                  onChange={(e) => {
                    const vals = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value,
                    );
                    setFormData({ ...formData, teamMembers: vals });
                  }}
                  disabled={isUsersLoading}
                >
                  {users.map((u) => (
                    <option key={u._id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={formStyles.label}>Tags (comma-separated)</label>
                <input
                  type="text"
                  style={formStyles.input}
                  placeholder="e.g. IoT, API, dashboard"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />.
              </div>
              <div className="">
                {error && (
                  <div style={{ color: "#ef4444", marginBottom: "0.5rem" }}>
                    *{error}
                  </div>
                )}
                {validationError && (
                  <div style={{ color: "#ef4444", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    *{validationError}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "0.6rem 1.2rem",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    color: "#334155",
                    borderRadius: "0.4rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1.2rem",
                    border: "none",
                    background: "#5b4fe8",
                    color: "white",
                    borderRadius: "0.4rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  <Save size={16} /> {isLoading ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p style={{ color: "#ef4444" }}>
                You do not have permission to create projects. Only Admins and
                Managers can perform this action.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "2rem",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default ProjectForm;
