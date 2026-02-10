import { supabase } from "../supabase";

export const pomodoroAPI = {
  // Get all sessions the user can access (RLS handles filtering)
  getAll: async () => {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select(`
        *,
        owner:profile_public!owner_id(id, full_name, avatar_url),
        pomodoro_collaborators(
          user_id,
          user:profile_public!user_id(id, full_name, avatar_url)
        )
      `)
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get single session by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select(`
        *,
        owner:profile_public!owner_id(id, full_name, avatar_url),
        pomodoro_collaborators(
          user_id,
          user:profile_public!user_id(id, full_name, avatar_url)
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Create a new session
  create: async (userId, title, settings = {}) => {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .insert({
        owner_id: userId,
        title,
        work_duration: settings.workDuration || 25,
        short_break: settings.shortBreak || 5,
        long_break: settings.longBreak || 15,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Update session (title, durations, is_public)
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete session
  delete: async (id) => {
    const { error } = await supabase
      .from("pomodoro_sessions")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  // Add a collaborator
  addCollaborator: async (sessionId, userId) => {
    const { data, error } = await supabase
      .from("pomodoro_collaborators")
      .upsert(
        { session_id: sessionId, user_id: userId },
        { onConflict: "session_id,user_id" }
      )
      .select(`
        user_id,
        user:profile_public!user_id(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Remove a collaborator
  removeCollaborator: async (sessionId, userId) => {
    const { error } = await supabase
      .from("pomodoro_collaborators")
      .delete()
      .eq("session_id", sessionId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
  },

  // Persist timer state (owner calls this on start/pause/reset/phase-switch)
  updateTimerState: async (id, timerState) => {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .update({
        timer_running: timerState.timer_running,
        timer_phase: timerState.timer_phase,
        timer_started_at: timerState.timer_started_at || null,
        timer_paused_remaining: timerState.timer_paused_remaining ?? null,
        completed_count: timerState.completed_count ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
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
