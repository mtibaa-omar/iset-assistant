import { useQuery } from "@tanstack/react-query";
import { programSubjectsAPI } from "../../services/api/apiProgramSubjects";
import { adminKeys } from "./adminKeys";

export function useProgramSubjects() {
  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.programSubjects.list(),
    queryFn: programSubjectsAPI.getAll,
  });

  return { programSubjects: data || [], isLoading, error };
}
