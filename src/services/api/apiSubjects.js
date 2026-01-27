import { supabase } from "../supabase";

export const subjectsAPI = {
  // Get subjects for a specific specialty and level (with semester grouping)
  getSubjectsByProgram: async (specialtyId, levelId) => {
    if (!specialtyId || !levelId) return [];

    const { data, error } = await supabase
      .from("program_subjects")
      .select(`
        id,
        coefficient,
        credit,
        mode,
        semester,
        subjects!inner(id, name),
        unites(id, name, code)
      `)
      .eq("specialty_id", specialtyId)
      .eq("level_id", levelId)
      .order("semester", { ascending: true });

    if (error) {
      console.error("getSubjectsByProgram error:", error);
      throw new Error(error.message);
    }
    return data || [];
  },

  // Get student grades for specific program subjects
  getStudentGrades: async (studentId, programSubjectIds, academicYearId) => {
    if (!studentId || !programSubjectIds?.length) return [];

    let query = supabase
      .from("student_grades")
      .select("*")
      .eq("student_id", studentId)
      .in("program_subject_id", programSubjectIds);

    if (academicYearId) {
      query = query.eq("academic_year_id", academicYearId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get current academic year
  getCurrentAcademicYear: async () => {
    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .eq("is_current", true)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data;
  },

  // Upsert student grade (insert or update)
  upsertGrade: async (gradeData) => {
    const { data, error } = await supabase
      .from("student_grades")
      .upsert(gradeData, {
        onConflict: "student_id,program_subject_id,academic_year_id",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Bulk upsert grades
  upsertGrades: async (gradesArray) => {
    const { data, error } = await supabase
      .from("student_grades")
      .upsert(gradesArray, {
        onConflict: "student_id,program_subject_id,academic_year_id",
      })
      .select();

    if (error) throw new Error(error.message);
    return data;
  },
};
