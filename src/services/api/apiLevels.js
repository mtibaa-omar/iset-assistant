import { supabase } from "../supabase";

export const levelsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  },
};
