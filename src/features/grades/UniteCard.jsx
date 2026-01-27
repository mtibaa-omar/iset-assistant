import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import SubjectRow from "./SubjectRow";
import { calculateAverage } from "../../utils/gradeCalculations";

export default function UniteCard({ unite, subjects, gradesMap, onGradeChange }) {
  const [isOpen, setIsOpen] = useState(true);

  const uniteStats = subjects.reduce(
    (acc, subject) => {
      const g = gradesMap[subject.id] || {};
      const avg = calculateAverage(subject.mode, g.note_dc, g.note_exam, g.note_tp1, g.note_tp2);
      acc.totalCredit += subject.credit;
      if (avg !== null && parseFloat(avg) >= 10) acc.acquiredCredit += subject.credit;
      return acc;
    },
    { totalCredit: 0, acquiredCredit: 0 }
  );

  return (
    <div className="overflow-hidden bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left transition-colors bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50"
      >
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-0.5">
            {unite}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subjects.length} matière{subjects.length > 1 ? "s" : ""} • {uniteStats.acquiredCredit}/{uniteStats.totalCredit} crédits acquis
          </p>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {subjects.map((subject) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              grades={gradesMap[subject.id] || {}}
              onGradeChange={onGradeChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
