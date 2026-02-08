import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whiteboardAPI } from "../../services/api/apiWhiteboard";
import { toast } from "react-toastify";

const wbKeys = {
  all: () => ["whiteboards"],
  detail: (id) => ["whiteboard", id],
};

// Get all whiteboards (RLS handles access filtering)
export function useWhiteboards() {
  return useQuery({
    queryKey: wbKeys.all(),
    queryFn: () => whiteboardAPI.getAll(),
  });
}

// Get single whiteboard
export function useWhiteboard(id) {
  return useQuery({
    queryKey: wbKeys.detail(id),
    queryFn: () => whiteboardAPI.getById(id),
    enabled: !!id,
  });
}

// Create whiteboard
export function useCreateWhiteboard(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title) => whiteboardAPI.create(userId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wbKeys.all() });
      toast.success("Tableau créé !");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Update whiteboard
export function useUpdateWhiteboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }) => whiteboardAPI.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: wbKeys.all() });
      queryClient.setQueryData(wbKeys.detail(data.id), data);
    },
    onError: (err) => toast.error(err.message),
  });
}

// Delete whiteboard
export function useDeleteWhiteboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => whiteboardAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wbKeys.all() });
      toast.success("Tableau supprimé");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Add collaborator
export function useAddCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ whiteboardId, userId, role }) =>
      whiteboardAPI.addCollaborator(whiteboardId, userId, role),
    onSuccess: (_, { whiteboardId }) => {
      queryClient.invalidateQueries({ queryKey: wbKeys.detail(whiteboardId) });
      toast.success("Collaborateur ajouté");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Remove collaborator
export function useRemoveCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ whiteboardId, userId }) =>
      whiteboardAPI.removeCollaborator(whiteboardId, userId),
    onSuccess: (_, { whiteboardId }) => {
      queryClient.invalidateQueries({ queryKey: wbKeys.detail(whiteboardId) });
      toast.success("Collaborateur retiré");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Search users
export function useSearchUsers(query) {
  return useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => whiteboardAPI.searchUsers(query),
    enabled: !!query && query.trim().length >= 2,
    staleTime: 30 * 1000,
  });
}
