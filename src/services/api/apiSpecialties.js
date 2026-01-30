import { supabase } from "../supabase";

export const specialtiesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  },
};
