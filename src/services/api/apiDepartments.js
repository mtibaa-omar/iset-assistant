import { supabase } from "../supabase";

export const departmentsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  },
};
