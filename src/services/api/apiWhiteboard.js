import { supabase } from "../supabase";

export const whiteboardAPI = {
  // Get all whiteboards the user can access (RLS handles filtering)
  getAll: async () => {
    const { data, error } = await supabase
      .from("whiteboards")
      .select(`
        *,
        owner:profile_public!owner_id(id, full_name, avatar_url),
        whiteboard_collaborators(
          user_id,
          role,
          user:profile_public!user_id(id, full_name, avatar_url)
        )
      `)
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get single whiteboard by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from("whiteboards")
      .select(`
        *,
        owner:profile_public!owner_id(id, full_name, avatar_url),
        whiteboard_collaborators(
          user_id,
          role,
          user:profile_public!user_id(id, full_name, avatar_url)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Create a new whiteboard
  create: async (userId, title) => {
    const { data, error } = await supabase
      .from("whiteboards")
      .insert({ owner_id: userId, title })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Update whiteboard (title, data, thumbnail, is_public)
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("whiteboards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete whiteboard
  delete: async (id) => {
    const { error } = await supabase
      .from("whiteboards")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  // Add a collaborator
  addCollaborator: async (whiteboardId, userId, role = "editor") => {
    const { data, error } = await supabase
      .from("whiteboard_collaborators")
      .upsert(
        { whiteboard_id: whiteboardId, user_id: userId, role },
        { onConflict: "whiteboard_id,user_id" }
      )
      .select(`
        user_id,
        role,
        user:profile_public!user_id(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Remove a collaborator
  removeCollaborator: async (whiteboardId, userId) => {
    const { error } = await supabase
      .from("whiteboard_collaborators")
      .delete()
      .eq("whiteboard_id", whiteboardId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  // Search users to invite (by name)
  searchUsers: async (query) => {
    if (!query || query.trim().length < 2) return [];

    const { data, error } = await supabase
      .from("profile_public")
      .select("id, full_name, avatar_url")
      .ilike("full_name", `%${query}%`)
      .limit(10);

    if (error) throw new Error(error.message);
    return data;
  },
};
