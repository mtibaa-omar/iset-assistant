import { useState, useMemo, useCallback } from "react";

export const DEGREE_OPTIONS = [
  { value: "all", label: "Licence et Master" },
  { value: "licence", label: "Licence" },
  { value: "master", label: "Master" },
];

export function useAdminFilters({
  levels = [],
  specialties = [],
  departments = [],
  data = [],
}) {
  const [filterDegree, setFilterDegree] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const availableLevels = useMemo(() => {
    if (filterDegree === "all") return levels;

    if (filterDegree === "licence") {
      return levels.filter((level) =>
        level.code?.toUpperCase().startsWith("L"),
      );
    }
    if (filterDegree === "master") {
      return levels.filter((level) =>
        level.code?.toUpperCase().startsWith("M"),
      );
    }

    return levels;
  }, [levels, filterDegree]);

  // Filter specialties based on degree and level
  const availableSpecialties = useMemo(() => {
    return specialties.filter((specialty) => {
      const matchesDegree =
        filterDegree === "all" || specialty.degree === filterDegree;

      // If level is selected, check if specialty is used with this level
      const matchesLevel =
        filterLevel === "all" ||
        data.some((item) =>
          item.program_subjects?.some(
            (ps) =>
              ps.specialties?.id === specialty.id &&
              ps.levels?.id === filterLevel,
          ),
        );

      return matchesDegree && matchesLevel;
    });
  }, [specialties, filterDegree, filterLevel, data]);

  // Handle degree change - reset level and specialty
  const handleDegreeChange = useCallback((newDegree) => {
    setFilterDegree(newDegree);
    setFilterLevel("all");
    setFilterSpecialty("all");
  }, []);

  // Handle level change - reset specialty
  const handleLevelChange = useCallback((newLevel) => {
    setFilterLevel(newLevel);
    setFilterSpecialty("all");
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilterDegree("all");
    setFilterLevel("all");
    setFilterSpecialty("all");
    setFilterDepartment("all");
  }, []);

  // Check if any filter is active
  const hasActiveFilters =
    filterDegree !== "all" ||
    filterLevel !== "all" ||
    filterSpecialty !== "all" ||
    filterDepartment !== "all";

  // Build filter options
  const levelOptions = useMemo(
    () => [
      { value: "all", label: "Tous les niveaux" },
      ...availableLevels.map((level) => {
        const degree = level.code?.toUpperCase().startsWith('L') ? ' (L)' : 
                       level.code?.toUpperCase().startsWith('M') ? ' (M)' : '';
        return {
          value: level.id,
          label: level.name + degree,
        };
      }),
    ],
    [availableLevels],
  );

  const deptMap = useMemo(() => {
    const map = {};
    departments.forEach((d) => {
      map[d.id] = d.code;
    });
    return map;
  }, [departments]);

  const specialtyOptions = useMemo(
    () => [
      { value: "all", label: "Toutes les spécialités" },
      ...availableSpecialties.map((s) => ({
        value: s.id,
        label: `${s.name} (${s.degree === 'licence' ? 'L' : 'M'})${deptMap[s.department_id] ? ` | ${deptMap[s.department_id]}` : ""}`,
      })),
    ],
    [availableSpecialties, deptMap],
  );

  // AG Grid external filter function
  const doesExternalFilterPass = useCallback(
    (node) => {
      const item = node.data;
      if (!item) return true;

      // Department filter (for subjects and items with specialty->department)
      if (filterDepartment !== "all") {
        // Direct department (subjects)
        if (item.departments?.id) {
          if (item.departments.id !== filterDepartment) return false;
        }
        // Via specialty (program_subjects, videos, unites)
        else if (item.specialties?.department_id) {
          if (item.specialties.department_id !== filterDepartment) return false;
        }
        // Via program_subjects for unites
        else if (item.program_subjects) {
          const matchesDepartment = item.program_subjects.some(
            (ps) => ps.specialties?.department_id === filterDepartment,
          );
          if (!matchesDepartment) return false;
        }
      }

      // Degree filter
      if (filterDegree !== "all") {
        // For subjects/unites: check program_subjects
        if (item.program_subjects) {
          const matchesDegree = item.program_subjects.some(
            (ps) => ps.specialties?.degree === filterDegree,
          );
          if (!matchesDegree) return false;
        }
        // For program_subjects: check specialties directly
        if (item.specialties && item.specialties.degree !== filterDegree) {
          return false;
        }
      }

      // Level filter
      if (filterLevel !== "all") {
        if (item.program_subjects) {
          const matchesLevel = item.program_subjects.some(
            (ps) => ps.levels?.id === filterLevel,
          );
          if (!matchesLevel) return false;
        }
        if (item.levels && item.levels.id !== filterLevel) {
          return false;
        }
      }

      // Specialty filter
      if (filterSpecialty !== "all") {
        if (item.program_subjects) {
          const matchesSpecialty = item.program_subjects.some(
            (ps) => ps.specialties?.id === filterSpecialty,
          );
          if (!matchesSpecialty) return false;
        }
        if (item.specialties && item.specialties.id !== filterSpecialty) {
          return false;
        }
      }

      return true;
    },
    [filterDepartment, filterDegree, filterLevel, filterSpecialty],
  );

  return {
    // Filter states
    filterDegree,
    filterLevel,
    filterSpecialty,
    filterDepartment,

    // Setters
    setFilterDepartment,
    handleDegreeChange,
    handleLevelChange,
    setFilterSpecialty,
    resetFilters,

    // Computed
    availableLevels,
    availableSpecialties,
    hasActiveFilters,
    deptMap,

    // Options for Select components
    degreeOptions: DEGREE_OPTIONS,
    levelOptions,
    specialtyOptions,

    // AG Grid external filtering
    doesExternalFilterPass,
    isExternalFilterPresent: () => hasActiveFilters,
  };
}

// Format date to French locale (DD/MM/YYYY)
export function formatDateFR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Format date to French short format (DD/MM)
export function formatDateShortFR(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}
