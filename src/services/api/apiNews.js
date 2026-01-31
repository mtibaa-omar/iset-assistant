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
      views_count: Array.isArray(newsItem.views_count) ? newsItem.views_count.length : 0
    }));
    
    return newsWithViews;
  },

  getRecent: async (days = 7) => {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('id, title, image_url, created_at')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (newsError) throw new Error(newsError.message);
    if (!news || news.length === 0) return [];

    const newsIds = news.map(n => n.id);
    const { data: readState } = await supabase
      .from('news_read_state')
      .select('news_id')
      .eq('user_id', user.id)
      .in('news_id', newsIds);

    const readNewsIds = new Set(readState?.map(r => r.news_id) || []);
    const unreadNews = news.filter(n => !readNewsIds.has(n.id));
    
    return unreadNews.slice(0, 5);
  },

  markAsRead: async (newsId) => {
    const { error } = await supabase.rpc('mark_news_as_read', { 
      p_news_id: newsId 
    });
    
    if (error) {
      console.error("[News] Error marking as read:", error);
      return;
    }
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
};
