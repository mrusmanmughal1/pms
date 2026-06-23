import { useState } from "react";
import { Trash2, UserCog } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useUsers, useUpdateUser, useDeleteUser } from "../hooks/user";
import { formatDate } from "../utils/date";
import ConfirmModal from "../components/ConfirmModal";
import { NavLink } from "react-router-dom";

export default function Users() {
  const { user } = useAuthStore();
  const { data: users = [], isLoading } = useUsers();
  const { mutate: updateUser, isLoading: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [userToDelete, setUserToDelete] = useState(null);

  if (user?.role !== "Admin") {
    return (
      <div className="page-content">
        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
        <p className="text-red-500">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const handleUpdateRole = (e) => {
    e.preventDefault();
    if (editingUser && selectedRole) {
      updateUser(
        {
          id: editingUser,
          updates: { role: selectedRole, status: selectedStatus },
        },
        {
          onSuccess: () => {
            setEditingUser(null);
            setSelectedRole("");
            setSelectedStatus("Active");
          },
        },
      );
    }
  };

  return (
    <div className="page-content">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <NavLink to="/register">Add New User</NavLink>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          overflowX: "auto",
        }}
      >
        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}
          >
            No users found
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Joined
                </th>
                <th
                  style={{
                    padding: "1rem",
                    fontWeight: "600",
                    color: "#475569",
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td
                    style={{
                      padding: "1rem",
                      color: "#334155",
                      fontWeight: "500",
                    }}
                  >
                    {u.name}
                  </td>
                  <td style={{ padding: "1rem", color: "#64748b" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {editingUser === u._id ? (
                      <form
                        onSubmit={handleUpdateRole}
                        style={{ display: "flex", gap: "0.5rem" }}
                      >
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          style={{
                            padding: "0.3rem",
                            borderRadius: "0.3rem",
                            border: "1px solid #cbd5e1",
                          }}
                          disabled={isUpdating}
                        >
                          <option value="User">User</option>
                          <option value="Manager">Manager</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          style={{
                            padding: "0.3rem",
                            borderRadius: "0.3rem",
                            border: "1px solid #cbd5e1",
                          }}
                          disabled={isUpdating}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          style={{
                            background: "#5b4fe8",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.3rem",
                            padding: "0.3rem 0.6rem",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUser(null)}
                          disabled={isUpdating}
                          style={{
                            background: "#e2e8f0",
                            color: "#334155",
                            border: "none",
                            borderRadius: "0.3rem",
                            padding: "0.3rem 0.6rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <span
                        style={{
                          background:
                            u.role === "Admin"
                              ? "#fee2e2"
                              : u.role === "Manager"
                                ? "#fef3c7"
                                : "#e0e7ff",
                          color:
                            u.role === "Admin"
                              ? "#991b1b"
                              : u.role === "Manager"
                                ? "#92400e"
                                : "#3730a3",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {editingUser === u._id ? (
                      <span style={{ color: "#94a3b8" }}>Editing...</span>
                    ) : (
                      <span
                        style={{
                          background:
                            (u.status || "Active") === "Active"
                              ? "#dcfce7"
                              : "#f1f5f9",
                          color:
                            (u.status || "Active") === "Active"
                              ? "#166534"
                              : "#475569",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {u.status || "Active"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", color: "#64748b" }}>
                    {formatDate(u.createdAt)}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button
                      onClick={() => {
                        setEditingUser(u._id);
                        setSelectedRole(u.role);
                        setSelectedStatus(u.status || "Active");
                      }}
                      disabled={isUpdating || isDeleting || u._id === user._id}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#3b82f6",
                        cursor: "pointer",
                        padding: "0.4rem",
                        marginRight: "0.5rem",
                      }}
                      title="Edit Role"
                    >
                      <UserCog size={18} />
                    </button>
                    <button
                      onClick={() => setUserToDelete(u)}
                      disabled={isUpdating || isDeleting || u._id === user._id}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "0.4rem",
                      }}
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          deleteUser(userToDelete._id, {
            onSuccess: () => setUserToDelete(null),
          });
        }}
        title="Delete User"
        message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
