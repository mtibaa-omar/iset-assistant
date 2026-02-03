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

export const getCurrentSemester = () => {
  const month = new Date().getMonth() + 1;
  return month >= 9 || month <= 2 ? "S1" : "S2";
};

export const calculateTotals = (subjects, gradesMap) => {
  let totalCredit = 0;
  let creditAcquis = 0;
  let weightedSum = 0;
  let coefWithGrades = 0;

  subjects.forEach((subject) => {
    const g = gradesMap[subject.id] || {};
    const avg = calculateAverage(
      subject.mode,
      g.note_dc,
      g.note_exam,
      g.note_tp1,
      g.note_tp2
    );
    const coef = parseFloat(subject.coefficient) || 1;
    const credit = parseFloat(subject.credit) || 0;

    totalCredit += credit;
    if (avg !== null && parseFloat(avg) >= 10) {
      creditAcquis += credit;
    }

    if (avg !== null) {
      weightedSum += parseFloat(avg) * coef;
      coefWithGrades += coef;
    }
  });

  const generalAverage = coefWithGrades > 0 ? (weightedSum / coefWithGrades).toFixed(2) : null;

  return {
    generalAverage,
    totalCredit,
    creditAcquis,
    activeSubjects: subjects.length,
  };
};
