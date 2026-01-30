import { useQuery } from "@tanstack/react-query";
import { departmentsAPI } from "../../services/api/apiDepartments";
import { adminKeys } from "./adminKeys";

export function useDepartments() {
  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.departments.list(),
    queryFn: departmentsAPI.getAll,
  });

  return { departments: data || [], isLoading, error };
}
