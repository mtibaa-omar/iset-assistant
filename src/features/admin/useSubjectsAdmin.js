import { useQuery } from "@tanstack/react-query";
import { subjectsAdminAPI } from "../../services/api/apiSubjectsAdmin";
import { adminKeys } from "./adminKeys";

export function useSubjectsAdmin() {
  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.subjects.list(),
    queryFn: subjectsAdminAPI.getAllWithDepartments,
  });

  return { subjects: data || [], isLoading, error };
}
