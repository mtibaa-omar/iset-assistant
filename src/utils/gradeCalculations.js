export const calculateAverage = (mode, note_dc, note_exam, note_tp1, note_tp2) => {
  if (mode === "atelier" && note_tp1 != null && note_tp2 != null) {
    return (parseFloat(note_tp1) * 0.5 + parseFloat(note_tp2) * 0.5).toFixed(2);
  }
  if (mode === "cours" && note_dc != null && note_exam != null) {
    return (parseFloat(note_dc) * 0.4 + parseFloat(note_exam) * 0.6).toFixed(2);
  }
  return null;
};

export const validateGrade = (value) => {
  if (value === "" || value === null) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return "Invalid number";
  if (num < 0) return "Min 0";
  if (num > 20) return "Max 20";
  return null;
};
