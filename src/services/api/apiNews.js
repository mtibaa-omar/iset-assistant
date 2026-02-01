import { supabase } from "../supabase";

export const newsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        views_count:news_read_state(count)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    const newsWithViews = (data || []).map(newsItem => ({
      ...newsItem,
      views_count: Array.isArray(newsItem.views_count) && newsItem.views_count.length > 0
        ? newsItem.views_count[0].count
        : 0
    }));
    return newsWithViews;
  },

  markAsRead: async (newsId) => {
    const { error } = await supabase.rpc('mark_news_as_read', { 
      p_news_id: newsId 
    });
    
    if (error) throw new Error(error.message);
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        views_count:news_read_state(count)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    
    return {
      ...data,
      views_count: Array.isArray(data.views_count) && data.views_count.length > 0
        ? data.views_count[0].count
        : 0
    };
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

  getUnreadNews: async (userCreatedAt) => {
    const { data, error } = await supabase.rpc("get_unread_news");
    if (error) throw new Error(error.message);
    if (userCreatedAt) {
      return (data || []).filter(item => item.created_at > userCreatedAt);
    }
    
    return data || [];
  },
};
