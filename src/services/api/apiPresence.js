import { supabase } from "../supabase";

// Presence API - manages online status tracking
export const presenceAPI = {
  // Subscribe to user presence in a specific context
  subscribeToUserPresence: (userId, onPresenceChange) => {
    const channel = supabase.channel(`user-presence:${userId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const isOnline = Object.keys(state).length > 0;
        onPresenceChange(isOnline);
      })
      .subscribe();

    return channel;
  },

  // Track your own presence globally
  trackGlobalPresence: (userId) => {
    const channel = supabase.channel('global-presence', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

    return channel;
  },

  // Get all currently online users
  getOnlineUsers: async () => {
    const channel = supabase.channel('global-presence');
    
    return new Promise((resolve) => {
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const userIds = new Set();
          
          Object.keys(state).forEach((presenceKey) => {
            const presences = state[presenceKey];
            presences.forEach((presence) => {
              if (presence.user_id) {
                userIds.add(presence.user_id);
              }
            });
          });
          
          resolve(userIds);
          supabase.removeChannel(channel);
        })
        .subscribe();
    });
  },

  // Unsubscribe from presence
  unsubscribe: (channel) => {
    if (channel) {
      channel.untrack();
      supabase.removeChannel(channel);
    }
  },
};
