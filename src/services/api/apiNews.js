import { supabase } from "../supabase";

export const newsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  create: async (newsData) => {
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  update: async (id, newsData) => {
    const { data, error} = await supabase
      .from('news')
      .update(newsData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },

  incrementViews: async (id) => {
    const { error } = await supabase.rpc('increment_news_views', { p_news_id: id });
    if (error) throw new Error(error.message);
  },
};
