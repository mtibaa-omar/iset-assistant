export const chatKeys = {
  messages: (subjectId) => ["chat", "messages", subjectId],
  subject: (subjectId) => ["chat", "subject", subjectId],
  accessibleSubjectsWithUnread: () => ["chat", "accessibleSubjects", "withUnread"],
};
