import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pomodoroAPI } from "../../services/api/apiPomodoro";
import { pomodoroKeys } from "./pomodoroKeys";
import { toast } from "react-toastify";

// Get all sessions (RLS handles access filtering)
export function usePomodoroSessions() {
  return useQuery({
    queryKey: pomodoroKeys.all(),
    queryFn: () => pomodoroAPI.getAll(),
  });
}

// Get single session
export function usePomodoroSession(id) {
  return useQuery({
    queryKey: pomodoroKeys.detail(id),
    queryFn: () => pomodoroAPI.getById(id),
    enabled: !!id,
  });
}

// Create session
export function useCreatePomodoro(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, settings }) =>
      pomodoroAPI.create(userId, title, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.all() });
      toast.success("Session créée !");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Update session
export function useUpdatePomodoro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }) => pomodoroAPI.update(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.all() });
      queryClient.invalidateQueries({
        queryKey: pomodoroKeys.detail(data.id),
      });
    },
    onError: (err) => toast.error(err.message),
  });
}

// Delete session
export function useDeletePomodoro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => pomodoroAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pomodoroKeys.all() });
      toast.success("Session supprimée");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Add collaborator
export function useAddPomodoroCollab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, userId }) =>
      pomodoroAPI.addCollaborator(sessionId, userId),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: pomodoroKeys.detail(sessionId),
      });
      toast.success("Collaborateur ajouté");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Remove collaborator
export function useRemovePomodoroCollab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, userId }) =>
      pomodoroAPI.removeCollaborator(sessionId, userId),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: pomodoroKeys.detail(sessionId),
      });
      toast.success("Collaborateur retiré");
    },
    onError: (err) => toast.error(err.message),
  });
}

// Search users
export function useSearchPomodoroUsers(query) {
  return useQuery({
    queryKey: pomodoroKeys.searchUsers(query),
    queryFn: () => pomodoroAPI.searchUsers(query),
    enabled: !!query && query.trim().length >= 2,
    staleTime: 30 * 1000,
  });
}
