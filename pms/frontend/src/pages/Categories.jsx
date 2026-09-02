import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pen,
  Plus,
  SaudiRiyal,
  Trash2,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  useAddCategoryScope,
  useDeleteCategoryScope,
} from "../hooks/project";
import ConfirmModal from "../components/ConfirmModal";
import { useDebounce } from "../hooks/useDebounce";

export default function Categories() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { data: categories = [], isLoading } =
    useCategories(debouncedSearchQuery);
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();
  const { mutate: updateCategory, isLoading: isUpdating } = useUpdateCategory();
  const { mutate: addScope, isLoading: isAddingScope } = useAddCategoryScope();
  const { mutate: deleteScope } = useDeleteCategoryScope();
  const [newCat, setNewCat] = useState("");
  const [newCatBudget, setNewCatBudget] = useState("");
  const [catToDelete, setCatToDelete] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingBudget, setEditingBudget] = useState("");
  const [editingCat, setEditingCat] = useState("");
  // Scope panel state
  const [expandedScopes, setExpandedScopes] = useState({});
  const [newScopeInput, setNewScopeInput] = useState({});

  const toggleScopePanel = (catId) =>
    setExpandedScopes((prev) => ({ ...prev, [catId]: !prev[catId] }));

  const handleAddScope = (cat) => {
    const scope = (newScopeInput[cat._id] || "").trim();
    if (!scope) return;
    addScope(
      { id: cat._id, scope },
      {
        onSuccess: () =>
          setNewScopeInput((prev) => ({ ...prev, [cat._id]: "" })),
      },
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    createCategory(
      { name: newCat.trim(), budget: Number(newCatBudget) || 0 },
      {
        onSuccess: () => {
          setNewCat("");
          setNewCatBudget(0);
        },
      },
    );
  };

  const handleUpdate = (id, cat, budget) => {
    const budgetValue = Number(budget || 0);
    updateCategory(
      { id, name: cat, budget: budgetValue },
      {
        onSuccess: () => {
          setEditingCategoryId(null);
          setEditingBudget("");
          setEditingCat("");
        },
      },
    );
  };

  if (user?.role !== "Admin") {
    return (
      <div className="page-content">
        <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>
        <p className="text-red-500">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
      </div>

      <div
        style={{
          maxWidth: "800px",
        }}
      >
        <form
          onSubmit={handleAdd}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <input
            type="text"
            placeholder="New Category Name"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            style={{
              padding: "0.6rem 1rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              background: "#fff",
            }}
            disabled={isCreating}
          />
          <input
            type="text"
            placeholder="Budget"
            value={newCatBudget}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numeric values (0-9 and decimal point)
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                setNewCatBudget(value);
              }
            }}
            style={{
              padding: "0.6rem 1rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              background: "#fff",
            }}
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={isCreating || !newCat.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.2rem",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            <Plus size={18} /> Add
          </button>
        </form>

        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              background: "#fff",
              outline: "none",
            }}
          />
        </div>
        <div
          style={{
            background: "#ffff",
            borderRadius: "0.5rem",
            overflow: "hidden",
            border: "1px solid #c9c9c9ff",
            boxShadow: "0px 20px 40px 0px rgba(0, 0, 0, 0.02)",
          }}
        >
          {isLoading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}
            >
              No categories found
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                    fontSize: "0.775rem",
                  }}
                >
                  <th
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#475569",
                    }}
                  >
                    Category Name
                  </th>
                  <th
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#475569",
                    }}
                  >
                    Scopes
                  </th>
                  <th
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#475569",
                    }}
                  >
                    Budget
                  </th>
                  <th
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#475569",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <>
                    <tr
                      key={cat._id}
                      style={{
                        fontSize: "0.875rem",
                        borderBottom: expandedScopes[cat._id]
                          ? "none"
                          : i < categories.length - 1
                            ? "1px solid #f1f5f9"
                            : "none",
                        backgroundColor: expandedScopes[cat._id]
                          ? "#fafbff"
                          : "#fff",
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          color: "#334155",
                          fontWeight: "500",
                          textTransform: "capitalize",
                        }}
                      >
                        {editingCategoryId === cat._id ? (
                          <input
                            type="text"
                            value={editingCat}
                            onChange={(e) => setEditingCat(e.target.value)}
                            style={{
                              width: "120px",
                              padding: "0.4rem 0.6rem",
                              border: "1px solid #cbd5e1",
                              borderRadius: "0.35rem",
                            }}
                          />
                        ) : (
                          cat.name
                        )}
                      </td>
                      {/* Scopes toggle */}
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <button
                          type="button"
                          onClick={() => toggleScopePanel(cat._id)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            fontSize: "0.78rem",
                            fontWeight: "500",
                            color: "#4f46e5",
                            background: "#eef2ff",
                            border: "1px solid #c7d2fe",
                            borderRadius: "0.35rem",
                            padding: "0.3rem 0.65rem",
                            cursor: "pointer",
                          }}
                        >
                          {expandedScopes[cat._id] ? (
                            <ChevronDown size={13} />
                          ) : (
                            <ChevronRight size={13} />
                          )}
                          {cat.scopes?.length || 0} scope
                          {(cat.scopes?.length || 0) !== 1 ? "s" : ""}
                        </button>
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          textAlign: "right",
                          color: "#475569",
                          fontWeight: "600",
                        }}
                      >
                        {/* //test  */}
                        {editingCategoryId === cat._id ? (
                          <input
                            type="text"
                            value={editingBudget}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                setEditingBudget(value);
                              }
                            }}
                            style={{
                              width: "100px",
                              padding: "0.4rem 0.6rem",
                              border: "1px solid #cbd5e1",
                              borderRadius: "0.35rem",
                              textAlign: "right",
                            }}
                          />
                        ) : (
                          <div>
                            <SaudiRiyal size={16} />{" "}
                            {(cat.budget ?? 0).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "1rem 1.5rem",
                          textAlign: "center",
                        }}
                      >
                        {editingCategoryId === cat._id ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <button
                              onClick={() => {
                                handleUpdate(
                                  cat._id,
                                  editingCat,
                                  editingBudget,
                                );
                              }}
                              disabled={isUpdating}
                              style={{
                                background: "#10b981",
                                border: "none",
                                color: "white",
                                padding: "0.45rem 0.75rem",
                                borderRadius: "0.35rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: "600",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategoryId(null);
                                setEditingBudget("");
                              }}
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #cbd5e1",
                                color: "#334155",
                                padding: "0.45rem 0.75rem",
                                borderRadius: "0.35rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: "600",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <button
                              onClick={() => {
                                setEditingCategoryId(cat._id);
                                setEditingBudget(cat.budget?.toString() ?? "");
                                setEditingCat(cat.name ?? "");
                              }}
                              disabled={isUpdating}
                              style={{
                                background: "#eef2ff",
                                border: "1px solid #c7d2fe",
                                color: "#4338ca",
                                padding: "0.45rem 0.75rem",
                                borderRadius: "0.35rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontWeight: "600",
                              }}
                            >
                              <Pen className="w-4 h-4" size={14} />
                            </button>
                            <button
                              onClick={() => setCatToDelete(cat)}
                              disabled={isDeleting}
                              style={{
                                background: "#fee2e2",
                                border: "1px solid #fca5a5",
                                color: "#dc2626",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#fecaca";
                                e.target.style.borderColor = "#f87171";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "#fee2e2";
                                e.target.style.borderColor = "#fca5a5";
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {/* Expandable Scopes Panel */}
                    {expandedScopes[cat._id] && (
                      <tr
                        style={{
                          borderBottom:
                            i < categories.length - 1
                              ? "1px solid #e2e8f0"
                              : "none",
                          backgroundColor: "#f8faff",
                        }}
                      >
                        <td
                          colSpan={4}
                          style={{ padding: "0.5rem 1.5rem 1rem 2.5rem" }}
                        >
                          {/* Scope tags */}
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "0.4rem",
                              marginBottom: "0.75rem",
                              minHeight: "28px",
                            }}
                          >
                            {(cat.scopes || []).length === 0 ? (
                              <span
                                style={{
                                  fontSize: "0.78rem",
                                  color: "#94a3b8",
                                  fontStyle: "italic",
                                }}
                              >
                                No scopes yet — add one below
                              </span>
                            ) : (
                              (cat.scopes || []).map((scope) => (
                                <span
                                  key={scope}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                    background: "#e0e7ff",
                                    color: "#3730a3",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                    padding: "0.25rem 0.5rem 0.25rem 0.7rem",
                                    borderRadius: "9999px",
                                    border: "1px solid #c7d2fe",
                                  }}
                                >
                                  {scope}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteScope({
                                        id: cat._id,
                                        scopeName: scope,
                                      })
                                    }
                                    title="Remove scope"
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#6366f1",
                                      display: "flex",
                                      alignItems: "center",
                                      padding: 0,
                                      lineHeight: 1,
                                    }}
                                  >
                                    <X size={11} strokeWidth={2.5} />
                                  </button>
                                </span>
                              ))
                            )}
                          </div>
                          {/* Add scope form */}
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="text"
                              placeholder="New scope name..."
                              value={newScopeInput[cat._id] || ""}
                              onChange={(e) =>
                                setNewScopeInput((prev) => ({
                                  ...prev,
                                  [cat._id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddScope(cat);
                                }
                              }}
                              style={{
                                padding: "0.4rem 0.75rem",
                                border: "1px solid #c7d2fe",
                                borderRadius: "0.4rem",
                                fontSize: "0.8rem",
                                outline: "none",
                                background: "#fff",
                                width: "220px",
                              }}
                              disabled={isAddingScope}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddScope(cat)}
                              disabled={
                                isAddingScope ||
                                !(newScopeInput[cat._id] || "").trim()
                              }
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                background: "#4f46e5",
                                color: "white",
                                border: "none",
                                borderRadius: "0.4rem",
                                padding: "0.4rem 0.85rem",
                                fontSize: "0.78rem",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              <Plus size={13} /> Add Scope
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!catToDelete}
        onClose={() => setCatToDelete(null)}
        onConfirm={() => {
          deleteCategory(catToDelete._id, {
            onSuccess: () => setCatToDelete(null),
          });
        }}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${catToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
