import { useState } from "react";
import { calculateAverage, validateGrade } from "../../utils/gradeCalculations";

const InputField = ({ label, value, error, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="w-10 text-xs font-medium text-slate-600 dark:text-zinc-400 sm:w-11">{label}</span>
    <div className="relative group">
      <input
        type="number"
        step="0.25"
        min="0"
        max="20"
        placeholder="--"
        value={value ?? ""}
        onChange={onChange}
        className={`w-16 sm:w-18 px-2 py-2 sm:py-1.5 text-sm text-center border rounded-lg ${
          error
            ? "border-red-400 dark:border-red-500 focus:ring-red-500 ring-2 ring-red-100 dark:ring-red-900/50"
            : "border-slate-300 dark:border-zinc-700 focus:ring-blue-500 dark:focus:ring-blue-500"
        } bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 transition-all`}
      />
      {error && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 z-10 px-2 py-1 text-[10px] font-medium text-white bg-red-500 dark:bg-red-600 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {error}
          <div className="absolute w-2 h-2 rotate-45 -translate-x-1/2 bg-red-500 -top-1 left-1/2 dark:bg-red-600"></div>
        </div>
      )}
    </div>
  </div>
);

export default function SubjectRow({ subject, grades, onGradeChange }) {
  const [errors, setErrors] = useState({});

  const handleFieldChange = (fieldName, value) => {
    const error = validateGrade(value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    
    const numValue = value === "" ? null : parseFloat(value);
    onGradeChange(subject.id, fieldName, numValue);
  };

  const { note_dc, note_exam, note_tp1, note_tp2 } = grades;
  
  const hasErrors = Object.values(errors).some(error => error !== null);
  const average = hasErrors ? null : calculateAverage(subject.mode, note_dc, note_exam, note_tp1, note_tp2);

  const isPassing = average && parseFloat(average) >= 10;

  return (
    <div className="transition-colors bg-white border-b dark:bg-transparent border-slate-200 dark:border-zinc-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-zinc-800/30">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-3">
        <div className="flex-1 min-w-0">
          <h4 className="mb-1.5 text-sm font-semibold text-slate-900 dark:text-zinc-200">
            {subject.subjects?.name}
          </h4>
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <span className="font-medium">Coef</span> {subject.coefficient}
            </span>
            <span className="text-slate-400 dark:text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="font-medium">{subject.credit}</span> crédit{subject.credit > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap sm:gap-3 sm:overflow-visible no-scrollbar">
          {subject.mode === "cours" ? (
            <>
              <InputField 
                label="DC" 
                field="note_dc" 
                value={note_dc}
                error={errors.note_dc}
                onChange={(e) => handleFieldChange("note_dc", e.target.value)}
              />
              <InputField 
                label="Exam" 
                field="note_exam" 
                value={note_exam}
                error={errors.note_exam}
                onChange={(e) => handleFieldChange("note_exam", e.target.value)}
              />
            </>
          ) : (
            <>
              <InputField 
                label="TP1" 
                field="note_tp1" 
                value={note_tp1}
                error={errors.note_tp1}
                onChange={(e) => handleFieldChange("note_tp1", e.target.value)}
              />
              <InputField 
                label="TP2" 
                field="note_tp2" 
                value={note_tp2}
                error={errors.note_tp2}
                onChange={(e) => handleFieldChange("note_tp2", e.target.value)}
              />
            </>
          )}
          <div className="flex items-center gap-2 pl-2 ml-2 border-l border-slate-300 dark:border-zinc-700 sm:pl-3 sm:ml-3">
            <span className="text-xs font-medium text-slate-600 dark:text-zinc-500">Moy</span>
            <div
              className={`w-16 sm:w-18 px-2 py-2 sm:py-1.5 text-sm text-center font-bold rounded-lg shadow-sm ${
                average
                  ? isPassing
                    ? "bg-gradient-to-br from-green-100 to-green-50 text-green-700 border border-green-200 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 dark:border-green-800/50"
                    : "bg-gradient-to-br from-red-100 to-red-50 text-red-700 border border-red-200 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-300 dark:border-red-800/50"
                  : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
              }`}
            >
              {average ?? "--"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
