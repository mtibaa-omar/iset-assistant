import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../../services/api/apiAuth";
import { authKeys } from "../authKeys";

export function useGetFormData() {
  const { data, isLoading, error } = useQuery({
    queryKey: authKeys.formData,
    queryFn: authAPI.getData,
  });

  return { 
    departments: data?.departments || [], 
    specialties: data?.specialties || [],
    levels: data?.levels || [],
    specialtyLevels: data?.specialtyLevels || [],
    isLoading, 
    error 
  };
}
