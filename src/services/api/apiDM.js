import { supabase } from "../supabase";

// DM
export const dmAPI = {
  // Get or create a conversation between two users
  getOrCreateConversation: async (otherUserId) => {
    const { data, error } = await supabase.rpc("get_or_create_dm", {
      other_user_id: otherUserId,
    });

    if (error) throw new Error(error.message);
    return { id: data };
  },

  // Get user by username 
  getUserByUsername: async (username) => {
    if (!username || username.trim() === "") {
      throw new Error("Nom d'utilisateur requis");
    }

    const { data, error } = await supabase.rpc("get_user_by_username", {
      p_username: username,
    });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Utilisateur non trouvé");

    return data[0];
  },

  // Search users by name
  searchUsers: async (query) => {
    if (!query || query.trim().length < 3) {
      return [];
    }

    const { data, error } = await supabase
      .from("profile_public")
      .select("id, full_name, avatar_url")
      .ilike("full_name", `%${query.trim()}%`)
      .limit(10);

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get all messages for a conversation with sender info
  getMessages: async (conversationId) => {
    const { data, error} = await supabase
      .from("dm_messages")
      .select(`
        id,
        body,
        kind,
        created_at,
        edited_at,
        deleted_at,
        sender_id,
        cloudinary_url,
        file_name,
        sender:profile_public!sender_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  // Send a new DM message (text, file, or exam)
  sendMessage: async ({
    conversationId,
    body,
    kind = "text",
    cloudinaryUrl = null,
    cloudinaryPublicId = null,
    fileName = null,
    examId = null,
  }) => {
    const { data, error } = await supabase.rpc("send_dm_message", {
      p_conversation_id: conversationId,
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
      conversation_id: message.conversation_id,
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

  // Subscribe to real-time messages for a conversation
  subscribeToMessages: (conversationId, onNewMessage) => {
    console.log("[DM] Creating subscription for conversation:", conversationId);

    const channel = supabase
      .channel(`dm-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "dm_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          if (payload.eventType !== "INSERT") return;

          try {
            const { data: sender, error } = await supabase
              .from("profile_public")
              .select("id, full_name, avatar_url")
              .eq("id", payload.new.sender_id)
              .single();

            if (error) {
              console.error("[DM] Error fetching sender:", error);
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
              sender,
            });
          } catch (err) {
            console.error("[DM] Subscription error:", err);
          }
        }
      )
      .subscribe((status) => {
        console.log("[DM] Subscription status:", status);
      });

    return channel;
  },

  // Get all conversations for current user with unread counts
  getConversations: async () => {
    const { data, error } = await supabase.rpc(
      "get_dm_conversations_with_unread"
    );

    if (error) throw new Error(error.message);

    return (data || []).map((conv) => ({
      id: conv.id,
      last_message_at: conv.last_message_at,
      unread_count: Number(conv.unread_count) || 0,
      user1: {
        id: conv.user1_id,
        full_name: conv.user1_full_name,
        avatar_url: conv.user1_avatar_url,
      },
      user2: {
        id: conv.user2_id,
        full_name: conv.user2_full_name,
        avatar_url: conv.user2_avatar_url,
      },
    }));
  },

  // Mark conversation as read for a user
  markAsRead: async (conversationId, userId) => {
    const { error } = await supabase
      .from("dm_read_state")
      .upsert(
        {
          conversation_id: conversationId,
          user_id: userId,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: "conversation_id,user_id" }
      );

    if (error) throw new Error(error.message);
  },

  // Delete a DM message
  deleteMessage: async (messageId) => {
    const { error } = await supabase
      .from("dm_messages")
      .update({ 
        deleted_at: new Date().toISOString(),
        body: null,
        cloudinary_url: null,
        cloudinary_public_id: null,
        file_name: null
      })
      .eq("id", messageId);

    if (error) throw new Error(error.message);
  },

  // Update a DM message
  updateMessage: async (messageId, newBody) => {
    const { data, error } = await supabase
      .from("dm_messages")
      .update({ body: newBody, edited_at: new Date().toISOString() })
      .eq("id", messageId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
