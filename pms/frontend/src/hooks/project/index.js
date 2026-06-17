// src/hooks/useProjects.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../../service";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// get project by category
export const useProjectsByCategory = (categoryName) => {
  return useQuery({
    queryKey: ["projects", categoryName],
    queryFn: () =>
      apiInstance
        .get(`${API_BASE}/projects/category/${categoryName}`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000,
  });
};
export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () =>
      apiInstance.get(`${API_BASE}/projects/stats`).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000,
  });
};

// Fetch all projects
export const useProjectsHook = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      apiInstance.get(`${API_BASE}/projects`).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000,
  });
};

// Create a new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProject) =>
      apiInstance
        .post(`${API_BASE}/projects`, newProject)
        .then((res) => res.data),
    onSuccess: () => {
      // Invalidate projects list so it refetches with the new entry
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Failed to create project");
    },
  });
};

// Update an existing project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      apiInstance
        .put(`${API_BASE}/projects/${id}`, updates)
        .then((res) => res.data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["projects", "stats"]),
        toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Failed to update project");
    },

  });
};

// Delete a project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      apiInstance.delete(`${API_BASE}/projects/${id}`).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Failed to delete project");
    }

  });
};
// get single project by id
export const useProjectById = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () =>
      apiInstance.get(`${API_BASE}/projects/${id}`).then((res) => res.data),
    enabled: !!id, // Only run the query if id is truthy
  });
}
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiInstance.get(`${API_BASE}/categories`).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCategory) =>
      apiInstance
        .post(`${API_BASE}/categories`, newCategory)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      apiInstance
        .delete(`${API_BASE}/categories/${id}`)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};

export default {
  useProjectsHook,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useCategories,
  useCreateCategory,
  useDeleteCategory,
};
