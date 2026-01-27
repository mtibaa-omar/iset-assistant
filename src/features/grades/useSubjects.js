import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { subjectsAPI } from "../../services/api/apiSubjects";

export const subjectKeys = {
  all: ["subjects"],
  program: (specialtyId, levelId) => ["subjects", "program", specialtyId, levelId],
  grades: (studentId) => ["subjects", "grades", studentId],
  academicYear: ["subjects", "academicYear"],
};

export function useSubjectsByProgram(specialtyId, levelId) {
  const { data, isLoading, error } = useQuery({
    queryKey: subjectKeys.program(specialtyId, levelId),
    queryFn: () => subjectsAPI.getSubjectsByProgram(specialtyId, levelId),
    enabled: !!specialtyId && !!levelId,
  });

  if (error) {
    console.error("useSubjectsByProgram error:", error);
  }

  return { subjects: data || [], isLoading, error };
}

export function useStudentGrades(studentId, programSubjectIds, academicYearId) {
  const stableIds = programSubjectIds?.slice().sort().join(',') || '';
  
  const { data, isLoading, error } = useQuery({
    queryKey: [...subjectKeys.grades(studentId), stableIds, academicYearId],
    queryFn: () => subjectsAPI.getStudentGrades(studentId, programSubjectIds, academicYearId),
    enabled: !!studentId && programSubjectIds?.length > 0,
  });

  return { grades: data || [], isLoading, error };
}

export function useCurrentAcademicYear() {
  const { data, isLoading, error } = useQuery({
    queryKey: subjectKeys.academicYear,
    queryFn: subjectsAPI.getCurrentAcademicYear,
  });

  return { academicYear: data, isLoading, error };
}

export function useUpsertGrades() {
  const queryClient = useQueryClient();

  const { mutate: upsertGrades, isPending: isUpdating } = useMutation({
    mutationFn: subjectsAPI.upsertGrades,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
      toast.success("Grades saved successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save grades");
    },
  });

  return { upsertGrades, isUpdating };
}
