import { supabase } from "../supabase";

// Chat API service for subject group chat
export const chatAPI = {
  // Get all messages for a program subject with sender info
  getMessages: async (programSubjectId) => {
    const { data, error } = await supabase
      .from("subject_messages")
      .select(`
        id,
        body,
        kind,
        created_at,
        sender_id,
        cloudinary_url,
        file_name,
        exam_id,
        sender:profile_public!sender_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("program_subject_id", programSubjectId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Send a new message to a subject chat (text, file, or exam)
  sendMessage: async ({
    programSubjectId,
    body,
    kind = "text",
    cloudinaryUrl = null,
    cloudinaryPublicId = null,
    fileName = null,
    examId = null,
  }) => {
    const { data, error } = await supabase.rpc("send_subject_message", {
      p_program_subject_id: programSubjectId,
      p_body: body,
      p_kind: kind,
      p_cloudinary_url: cloudinaryUrl,
      p_cloudinary_public_id: cloudinaryPublicId,
      p_file_name: fileName,
      p_exam_id: examId,
    });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Message non créé");

    // Transform RPC response to match expected format
    const message = data[0];
    return {
      id: message.id,
      program_subject_id: message.program_subject_id,
      sender_id: message.sender_id,
      body: message.body,
      kind: message.kind,
      cloudinary_url: message.cloudinary_url,
      file_name: message.file_name,
      exam_id: message.exam_id,
      created_at: message.created_at,
      sender: {
        id: message.sender_id,
        full_name: message.sender_full_name,
        avatar_url: message.sender_avatar_url,
      },
    };
  },

  // Get subject info for chat header
  getSubjectInfo: async (programSubjectId) => {
    const { data, error } = await supabase
      .from("program_subjects")
      .select(`
        id,
        mode,
        semester,
        subjects (
          id,
          name
        )
      `)
      .eq("id", programSubjectId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Subscribe to real-time messages for a subject
  subscribeToMessages: (programSubjectId, onNewMessage) => {
    const channel = supabase
      .channel(`subject-chat-${programSubjectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "subject_messages",
          filter: `program_subject_id=eq.${programSubjectId}`,
        },
        async (payload) => {
          try {
            const { data: sender, error } = await supabase
              .from("profile_public")
              .select("id, full_name, avatar_url")
              .eq("id", payload.new.sender_id)
              .single();

            if (error) {
              console.error("[Chat] Error fetching sender:", error);
              return;
            }

            onNewMessage({
              id: payload.new.id,
              body: payload.new.body,
              kind: payload.new.kind,
              created_at: payload.new.created_at,
              sender_id: payload.new.sender_id,
              cloudinary_url: payload.new.cloudinary_url,
              file_name: payload.new.file_name,
              exam_id: payload.new.exam_id,
              sender,
            });
          } catch (err) {
            console.error("[Chat] Subscription error:", err);
          }
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log("[Chat] Successfully subscribed");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("[Chat] Subscription failed:", status, err);
        }
      });

    return channel;
  },

  // Mark subject chat as read for current user
  markAsRead: async (programSubjectId) => {
    const { error } = await supabase.rpc("mark_subject_as_read", {
      p_program_subject_id: programSubjectId,
    });

    if (error) throw new Error(error.message);
  },

  // Get accessible subjects with unread counts (for navigation)
  getSubjectsWithUnread: async () => {
    const { data, error } = await supabase.rpc(
      "get_accessible_subjects_with_unread"
    );

    if (error) throw new Error(error.message);
    return data || [];
  },
};
