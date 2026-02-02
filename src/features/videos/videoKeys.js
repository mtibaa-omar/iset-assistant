export const videoKeys = {
  recent: () => ['videos', 'recent'],
  user: (specialtyId, levelId) => ["videos", "user", specialtyId, levelId],
};