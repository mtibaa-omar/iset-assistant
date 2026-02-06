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
import { calculateTotals, getCurrentSemester } from "../utils/gradeCalculations";
import Select from "../ui/components/Select";
import StatCard from "../ui/components/StatCard";
import { BsCalculator } from "react-icons/bs";

const SEMESTERS = [
  { value: "S1", label: "Semestre 1" },
  { value: "S2", label: "Semestre 2" },
];



export default function Calcul() {
  const { user } = useUser();
  const [localGrades, setLocalGrades] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(getCurrentSemester);

  const specialtyId = user?.specialty_id;
  const levelId = user?.level_id;

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
    return calculateTotals(filteredSubjects, gradesMap);
  }, [filteredSubjects, gradesMap]);

  const handleSave = () => {
    if (!user?.id || !academicYear?.id)
      return toast.error("Utilisateur ou année académique manquant");
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
    if (gradesToSave.length === 0) return toast.info("Aucune note à enregistrer");
    upsertGrades(gradesToSave, {
      onSuccess: () => {
        setHasChanges(false);
        setTimeout(() => setLocalGrades({}), 300);
      },
    });
  };

  return (
    <div className="px-4 pb-12 space-y-6 overflow-y-auto md:px-6 lg:px-10 md:py-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20">
            <BsCalculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold md:text-3xl text-slate-800 dark:text-white">
            Calculatrice
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Moyenne Générale"
          value={totals.generalAverage || "-"}
          valueColor={
            totals.generalAverage && parseFloat(totals.generalAverage) >= 10
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        />
        <StatCard
          title="Crédits Acquis"
          value={`${totals.creditAcquis} / ${totals.totalCredit}`}
        />
        <StatCard title="Matières" value={filteredSubjects.length} />
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
            {isUpdating ? "Enregistrement..." : "Enregistrer"}
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
