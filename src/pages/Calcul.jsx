import { useState, useMemo, useCallback } from "react";
import { Save } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../features/auth/useUser";
import {
  useSubjectsByProgram,
  useStudentGrades,
  useCurrentAcademicYear,
  useUpsertGrades,
} from "../features/grades/useSubjects";
import Button from "../ui/components/Button";
import UniteCard from "../features/grades/UniteCard";
import { calculateAverage } from "../utils/gradeCalculations";
import Select from "../ui/components/Select";
import StatCard from "../ui/components/StatCard";

const SEMESTERS = [
  { value: "S1", label: "Semestre 1" },
  { value: "S2", label: "Semestre 2" },
];

const getDefaultSemester = () => {
  const month = new Date().getMonth() + 1;
  return month >= 9 || month <= 2 ? "S1" : "S2";
};

export default function Calcul() {
  const { user } = useUser();
  const [localGrades, setLocalGrades] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(getDefaultSemester);

  const specialtyId = user?.user_metadata?.speciality;
  const levelId = user?.user_metadata?.level;

  const { subjects } = useSubjectsByProgram(specialtyId, levelId);
  const { academicYear } = useCurrentAcademicYear();
  const { upsertGrades, isUpdating } = useUpsertGrades();

  const programSubjectIds = useMemo(
    () => subjects.map((s) => s.id),
    [subjects],
  );
  const { grades } = useStudentGrades(
    user?.id,
    programSubjectIds,
    academicYear?.id,
  );

  const filteredSubjects = useMemo(() => {
    if (!selectedSemester) return subjects;
    return subjects.filter((s) => s.semester === selectedSemester);
  }, [subjects, selectedSemester]);

  const gradesMap = useMemo(() => {
    const map = {};
    grades.forEach((g) => {
      map[g.program_subject_id] = {
        note_dc: g.note_dc,
        note_exam: g.note_exam,
        note_tp1: g.note_tp1,
        note_tp2: g.note_tp2,
      };
    });
    Object.keys(localGrades).forEach((id) => {
      map[id] = { ...map[id], ...localGrades[id] };
    });
    return map;
  }, [grades, localGrades]);

  const groupedByUnite = useMemo(() => {
    const groups = {};
    filteredSubjects.forEach((subject) => {
      const uniteName = subject.unites?.name || "Other";
      if (!groups[uniteName]) groups[uniteName] = [];
      groups[uniteName].push(subject);
    });
    return groups;
  }, [filteredSubjects]);

  const onGradeChange = useCallback((subjectId, field, value) => {
    const numValue =
      value === "" || value === null || Number.isNaN(value) ? null : value;
    setLocalGrades((prev) => ({
      ...prev,
      [subjectId]: { ...prev[subjectId], [field]: numValue },
    }));
    setHasChanges(true);
  }, []);

  const totals = useMemo(() => {
    let totalCoef = 0,
      totalCredit = 0,
      creditAcquis = 0,
      weightedSum = 0,
      coefWithGrades = 0;
    filteredSubjects.forEach((subject) => {
      const g = gradesMap[subject.id] || {};
      const avg = calculateAverage(
        subject.mode,
        g.note_dc,
        g.note_exam,
        g.note_tp1,
        g.note_tp2,
      );
      totalCoef += parseFloat(subject.coefficient || 0);
      totalCredit += parseFloat(subject.credit || 0);
      if (avg) {
        creditAcquis += parseFloat(avg) >= 10 ? subject.credit : 0;
        weightedSum += parseFloat(avg) * parseFloat(subject.coefficient);
        coefWithGrades += parseFloat(subject.coefficient);
      }
    });
    return {
      totalCoef,
      totalCredit,
      creditAcquis,
      generalAverage:
        coefWithGrades > 0 ? (weightedSum / coefWithGrades).toFixed(2) : null,
    };
  }, [filteredSubjects, gradesMap]);

  const handleSave = () => {
    if (!user?.id || !academicYear?.id)
      return toast.error("Missing user or academic year");
    const gradesToSave = filteredSubjects
      .map((subject) => {
        const g = gradesMap[subject.id] || {};
        return {
          student_id: user.id,
          program_subject_id: subject.id,
          academic_year_id: academicYear.id,
          note_dc: g.note_dc,
          note_exam: g.note_exam,
          note_tp1: g.note_tp1,
          note_tp2: g.note_tp2,
        };
      })
      .filter(
        (r) =>
          r.note_dc != null ||
          r.note_exam != null ||
          r.note_tp1 != null ||
          r.note_tp2 != null,
      );
    if (gradesToSave.length === 0) return toast.info("No grades to save");
    upsertGrades(gradesToSave, {
      onSuccess: () => {
        setHasChanges(false);
        setTimeout(() => setLocalGrades({}), 300);
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Grade Calculator
      </h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title="General Average"
          value={totals.generalAverage || "-"}
          valueColor={
            totals.generalAverage && parseFloat(totals.generalAverage) >= 10
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        />
        <StatCard
          title="Credits Acquired"
          value={`${totals.creditAcquis} / ${totals.totalCredit}`}
          valueColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard title="Total Coefficient" value={totals.totalCoef} />
        <StatCard title="Subjects" value={filteredSubjects.length} />
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            options={SEMESTERS}
          />

          <Button
            onClick={handleSave}
            disabled={!hasChanges || isUpdating}
            icon={Save}
            variant="primary"
          >
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
        {Object.entries(groupedByUnite).map(([unite, subjects]) => (
          <UniteCard
            key={unite}
            unite={unite}
            subjects={subjects}
            gradesMap={gradesMap}
            onGradeChange={onGradeChange}
          />
        ))}
      </div>
    </div>
  );
}
