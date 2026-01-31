
import { supabase } from "../supabase";

export const programSubjectsAPI = {
  getAll: async function getAll() {
    const { data, error } = await supabase
      .from("program_subjects")
      .select(`
        *,
        subjects (
          id,
          name
        ),
        specialties (
          id,
          name,
          degree,
          department_id,
          departments (
            id,
            name
          )
        ),
        levels (
          id,
          name,
          code
        ),
        unites (
          id,
          name,
          code
        )
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  create: async (programSubjectData) => {
    const { data, error } = await supabase
      .from('program_subjects')
      .insert([programSubjectData])
      .select(`
        id,
        semester,
        mode,
        coefficient,
        credit,
        created_at,
        subjects(id, name),
        specialties(id, name, degree),
        levels(id, name, code),
        unites(id, name, code)
      `)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  update: async (id, programSubjectData) => {
    const { data, error } = await supabase
      .from('program_subjects')
      .update(programSubjectData)
      .eq('id', id)
      .select(`
        id,
        semester,
        mode,
        coefficient,
        credit,
        created_at,
        subjects(id, name),
        specialties(id, name, degree),
        levels(id, name, code),
        unites(id, name, code)
      `)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('program_subjects')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },
};
