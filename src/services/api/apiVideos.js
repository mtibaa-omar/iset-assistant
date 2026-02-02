import { supabase } from "../supabase";

export const videosAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from("videos")
      .select(`
        *,
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
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async create(videoData) {
    const { data, error } = await supabase
      .from("videos")
      .insert([videoData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, videoData) {
    const { data, error } = await supabase
      .from("videos")
      .update(videoData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  getRecentVideos: async (specialtyId, levelId, userCreatedAt) => {
    if (!specialtyId || !levelId || !userCreatedAt) return [];

    const { data, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        description,
        video_url,
        specialty_id,
        level_id,
        created_at
      `)
      .or(`specialty_id.eq.${specialtyId},specialty_id.is.null`)
      .or(`level_id.eq.${levelId},level_id.is.null`)
      .gt("created_at", userCreatedAt)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);
    return data || [];
  },

  getUserVideos: async (specialtyId, levelId) => {
    if (!specialtyId || !levelId) return [];

    const { data, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        description,
        video_url,
        specialty_id,
        level_id,
        created_at,
        specialties (
          id,
          name,
          degree
        ),
        levels (
          id,
          name
        )
      `)
      .or(`specialty_id.eq.${specialtyId},specialty_id.is.null`)
      .or(`level_id.eq.${levelId},level_id.is.null`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },
};
