export const pomodoroKeys = {
  all: () => ["pomodoro", "sessions"],
  detail: (id) => ["pomodoro", "session", id],
  searchUsers: (query) => ["pomodoro", "search", query],
};
