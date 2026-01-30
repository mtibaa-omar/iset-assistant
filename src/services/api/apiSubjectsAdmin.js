import { supabase } from "../supabase";

export const subjectsAdminAPI = {
  getAllWithDepartments: async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        id,
        name,
        created_at,
        departments!inner(id, name, code),
        program_subjects(
          id,
          specialties(id, name, degree),
          levels(id, name)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  create: async (subjectData) => {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subjectData])
      .select(`
        id,
        name,
        created_at,
        departments!inner(id, name, code)
      `)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  update: async (id, subjectData) => {
    const { data, error } = await supabase
      .from('subjects')
      .update(subjectData)
      .eq('id', id)
      .select(`
        id,
        name,
        created_at,
        departments!inner(id, name, code)
      `)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },
};
