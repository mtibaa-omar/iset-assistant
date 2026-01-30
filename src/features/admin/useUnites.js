import { useQuery } from "@tanstack/react-query";
import { unitesAPI } from "../../services/api/apiUnites";
import { adminKeys } from "./adminKeys";

export function useUnites() {
  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.unites.list(),
    queryFn: unitesAPI.getAll,
  });

  return { unites: data || [], isLoading, error };
}
