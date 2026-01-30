import { supabase } from "../supabase";

export const unitesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('unites')
      .select(`
        id,
        name,
        code,
        program_subjects(
          id,
          specialties(id, name, degree),
          levels(id, name, code)
        )
      `)
      .order('name', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  },

  create: async (uniteData) => {
    const { data, error } = await supabase
      .from('unites')
      .insert([uniteData])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  update: async (id, uniteData) => {
    const { data, error } = await supabase
      .from('unites')
      .update(uniteData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('unites')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },
};
