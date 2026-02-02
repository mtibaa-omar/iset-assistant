export const dmKeys = {
  conversations: (userId) => ["dm", "conversations", userId],
  messages: (conversationId) => ["dm", "messages", conversationId],
  user: (username) => ["dm", "user", username],
  searchUsers: (query) => ["dm", "search", query],
};
