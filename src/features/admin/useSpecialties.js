import { useQuery } from "@tanstack/react-query";
import { specialtiesAPI } from "../../services/api/apiSpecialties";
import { adminKeys } from "./adminKeys";

export function useSpecialties() {
  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.specialties.list(),
    queryFn: specialtiesAPI.getAll,
  });

  return { specialties: data || [], isLoading, error };
}
