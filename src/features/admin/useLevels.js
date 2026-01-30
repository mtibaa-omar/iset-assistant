import { useQuery } from "@tanstack/react-query";
import { levelsAPI } from "../../services/api/apiLevels";
import { adminKeys } from "./adminKeys";

export function useLevels() {
  const { data, isLoading, error } = useQuery({
    queryKey: adminKeys.levels.list(),
    queryFn: levelsAPI.getAll,
  });

  return { levels: data || [], isLoading, error };
}
