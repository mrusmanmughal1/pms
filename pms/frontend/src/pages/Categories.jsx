import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "../hooks/project";
import ConfirmModal from "../components/ConfirmModal";

export default function Categories() {
  const { user } = useAuthStore();
  const { data: categories = [], isLoading } = useCategories();
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();
  const [newCat, setNewCat] = useState("");
  const [catToDelete, setCatToDelete] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    createCategory(
      { name: newCat.trim() },
      {
        onSuccess: () => setNewCat(""),
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

      <div style={{ maxWidth: "600px" }}>
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}
        >
          <input
            type="text"
            placeholder="New Category Name"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            style={{
              flex: 1,
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
              background: "#5b4fe8",
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
            background: "#fff",
            borderRadius: "0.5rem",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
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
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {categories.map((cat, i) => (
                <li
                  key={cat._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.5rem",
                    borderBottom:
                      i < categories.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#334155" }}>
                    {cat.name}
                  </span>
                  <button
                    onClick={() => setCatToDelete(cat)}
                    disabled={isDeleting}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: "0.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0.3rem",
                    }}
                    title="Delete Category"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
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
