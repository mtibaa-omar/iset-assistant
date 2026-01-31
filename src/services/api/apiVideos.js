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
};
