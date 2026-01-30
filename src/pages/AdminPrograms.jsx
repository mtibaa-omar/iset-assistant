import { useState, useMemo, useRef, useCallback } from "react";
import { Plus, Save, Loader2, Trash2, FilterX } from "lucide-react";
import { useProgramSubjects } from "../features/admin/useProgramSubjects";
import { useCreateProgramSubject, useUpdateProgramSubject, useDeleteProgramSubject } from "../features/admin/useProgramSubjectsMutations";
import { useSubjectsAdmin } from "../features/admin/useSubjectsAdmin";
import { useLevels } from "../features/admin/useLevels";
import { useSpecialties } from "../features/admin/useSpecialties";
import { useUnites } from "../features/admin/useUnites";
import { useAdminFilters } from "../features/admin/hooks/useAdminFilters";
import AdminTable from "../features/admin/components/AdminTable";
import ActionsCellRenderer from "../features/admin/components/ActionsCellRenderer";
import Button from "../ui/components/Button";
import Spinner from "../ui/components/Spinner";
import Input from "../ui/components/Input";
import Select from "../ui/components/Select";
import Modal from "../ui/components/Modal";
import Confirm from "../ui/components/Confirm";

const SEMESTER_OPTIONS = [
  { value: "S1", label: "Semestre 1" },
  { value: "S2", label: "Semestre 2" },
];

const MODE_OPTIONS = [
  { value: "cours", label: "Cours" },
  { value: "atelier", label: "Atelier" },
];

const emptyProgramSubject = {
  subject_id: "",
  specialty_id: "",
  level_id: "",
  semester: "S1",
  unite_id: "",
  mode: "cours",
  coefficient: "",
  credit: "",
};

export default function AdminPrograms() {
  const gridRef = useRef(null);
  const { programSubjects, isLoading } = useProgramSubjects();
  const { subjects, isLoading: isSubjectsLoading } = useSubjectsAdmin();
  const { levels, isLoading: isLevelsLoading } = useLevels();
  const { specialties, isLoading: isSpecialtiesLoading } = useSpecialties();
  const { unites, isLoading: isUnitesLoading } = useUnites();
  const { createProgramSubject, isCreating } = useCreateProgramSubject();
  const { updateProgramSubject, isUpdating } = useUpdateProgramSubject();
  const { deleteProgramSubject, isDeleting } = useDeleteProgramSubject();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyProgramSubject);
  
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const {
    filterDegree,
    filterLevel,
    filterSpecialty,
    handleDegreeChange,
    handleLevelChange,
    setFilterSpecialty,
    resetFilters,
    hasActiveFilters,
    degreeOptions,
    levelOptions,
    specialtyOptions,
    doesExternalFilterPass,
    isExternalFilterPresent,
  } = useAdminFilters({ levels, specialties, data: programSubjects });

  const [filterSemester, setFilterSemester] = useState("all");

  const semesterFilterOptions = [
    { value: "all", label: "Tous les semestres" },
    ...SEMESTER_OPTIONS,
  ];

  const subjectOptions = useMemo(() => 
    subjects.map(s => ({ value: s.id, label: s.name }))
  , [subjects]);
  const specialtyFormOptions = useMemo(() => 
    specialties.map(s => ({ value: s.id, label: `${s.name} (${s.degree === 'licence' ? 'L' : 'M'})` }))
  , [specialties]);

  const levelFormOptions = useMemo(() => 
    levels.map(l => ({ value: l.id, label: l.name }))
  , [levels]);
  const uniteOptions = useMemo(() => 
    unites.map(u => ({ value: u.id, label: u.name }))
  , [unites]);

  const programSubjectsWithComputedFields = useMemo(() => {
    return programSubjects.map(ps => ({
      ...ps,
      subject_name: ps.subjects?.name || "-",
      specialty_name: ps.specialties?.name || "-",
      level_name: ps.levels?.name || "-",
      unite_name: ps.unites?.name || "-",
      mode_label: ps.mode === "cours" ? "Cours" : "Atelier",
    }));
  }, [programSubjects]);

  const doesExternalFilterPassExtended = useCallback((node) => {
    if (!doesExternalFilterPass(node)) return false;
    
    if (filterSemester !== "all" && node.data.semester !== filterSemester) {
      return false;
    }
    
    return true;
  }, [doesExternalFilterPass, filterSemester]);

  const columnDefs = useMemo(() => [
    { 
      field: "subject_name", 
      headerName: "Matière", 
      flex: 2,
      filter: true,
      sortable: true,
    },
    { 
      field: "specialty_name", 
      headerName: "Spécialité", 
      flex: 1,
      filter: true,
      sortable: true,
    },
    { 
      field: "level_name", 
      headerName: "Niveau", 
      width: 100,
      filter: true,
      sortable: true,
    },
    { 
      field: "semester", 
      headerName: "Semestre", 
      width: 100,
      filter: true,
      sortable: true,
    },
    { 
      field: "unite_name", 
      headerName: "Unité", 
      width: 120,
      filter: true,
      sortable: true,
    },
    { 
      field: "coefficient", 
      headerName: "Coef", 
      width: 80,
      sortable: true,
    },
    { 
      field: "credit", 
      headerName: "Crédit", 
      width: 80,
      sortable: true,
    },
    { 
      headerName: "Actions", 
      width: 100,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: "right",
    },
  ], []);

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes() || [];
    setSelectedRows(selectedNodes.map(node => node.data));
  }, []);

  const context = useMemo(() => ({
    onEdit: openEditModal,
    onDelete: handleDeleteClick,
    isDeleting,
  }), [isDeleting]);

  function openCreateModal() {
    setEditingItem(null);
    setFormData(emptyProgramSubject);
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      subject_id: item.subjects?.id || "",
      specialty_id: item.specialties?.id || "",
      level_id: item.levels?.id || "",
      semester: item.semester || "S1",
      unite_id: item.unites?.id || "",
      mode: item.mode || "cours",
      coefficient: item.coefficient?.toString() || "",
      credit: item.credit?.toString() || "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(emptyProgramSubject);
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      coefficient: parseFloat(formData.coefficient),
      credit: parseFloat(formData.credit),
    };
    
    if (editingItem) {
      updateProgramSubject({ id: editingItem.id, data: submissionData }, { onSuccess: closeModal });
    } else {
      createProgramSubject(submissionData, { onSuccess: closeModal });
    }
  }

  function handleDeleteClick(id) {
    setDeleteTargetId(id);
    setIsConfirmOpen(true);
  }

  function handleConfirmDelete() {
    if (deleteTargetId) {
      deleteProgramSubject(deleteTargetId, {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setDeleteTargetId(null);
        }
      });
    }
  }

  function handleBulkDelete() {
    setDeleteTargetId(null);
    setIsConfirmOpen(true);
  }

  function handleConfirmBulkDelete() {
    selectedRows.forEach(row => deleteProgramSubject(row.id));
    setIsConfirmOpen(false);
    setSelectedRows([]);
  }

  function handleResetFilters() {
    resetFilters();
    setFilterSemester("all");
  }

  const anyActiveFilters = hasActiveFilters || filterSemester !== "all";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 pt-0 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
          Gestion des Affectations
        </h1>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-40">
              <Select
                label=""
                value={filterDegree}
                onChange={(e) => handleDegreeChange(e.target.value)}
                options={degreeOptions}
              />
            </div>
            <div className="w-40">
              <Select
                label=""
                value={filterLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                options={levelOptions}
                disabled={isLevelsLoading}
              />
            </div>
            <div className="w-48">
              <Select
                label=""
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                options={specialtyOptions}
                disabled={isSpecialtiesLoading}
              />
            </div>
            <div className="w-40">
              <Select
                label=""
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                options={semesterFilterOptions}
              />
            </div>
            {anyActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-600 transition-colors rounded-lg hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
              >
                <FilterX className="w-4 h-4" />
                Réinitialiser
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <Button onClick={handleBulkDelete} variant="danger" icon={Trash2}>
                Supprimer ({selectedRows.length})
              </Button>
            )}
            <Button onClick={openCreateModal} icon={Plus}>
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      <AdminTable
        ref={gridRef}
        rowData={programSubjectsWithComputedFields}
        columnDefs={columnDefs}
        onSelectionChanged={onSelectionChanged}
        context={context}
        doesExternalFilterPass={doesExternalFilterPassExtended}
        isExternalFilterPresent={() => hasActiveFilters || filterSemester !== "all"}
        noRowsMessage={anyActiveFilters ? "Aucune affectation correspondant aux filtres" : "Aucune affectation pour le moment"}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? "Modifier l'affectation" : "Nouvelle affectation"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Select
            label="Matière"
            value={formData.subject_id}
            onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
            options={subjectOptions}
            required
            disabled={isSubjectsLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Spécialité"
              value={formData.specialty_id}
              onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
              options={specialtyFormOptions}
              required
              disabled={isSpecialtiesLoading}
            />
            <Select
              label="Niveau"
              value={formData.level_id}
              onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
              options={levelFormOptions}
              required
              disabled={isLevelsLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Semestre"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              options={SEMESTER_OPTIONS}
              required
            />
            <Select
              label="Unité"
              value={formData.unite_id}
              onChange={(e) => setFormData({ ...formData, unite_id: e.target.value })}
              options={uniteOptions}
              required
              disabled={isUnitesLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Mode"
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              options={MODE_OPTIONS}
              required
            />
            <Input
              label="Coefficient"
              type="number"
              step="0.5"
              min="0.5"
              value={formData.coefficient}
              onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })}
              required
              placeholder="Ex: 2"
            />
            <Input
              label="Crédit"
              type="number"
              step="0.5"
              min="0"
              value={formData.credit}
              onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
              required
              placeholder="Ex: 3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingItem ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      <Confirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteTargetId ? handleConfirmDelete : handleConfirmBulkDelete}
        isLoading={isDeleting}
        variant="danger"
        title={deleteTargetId ? "Supprimer cette affectation ?" : `Supprimer ${selectedRows.length} affectation(s) ?`}
        message={deleteTargetId 
          ? "Cette action est irréversible. L'affectation sera définitivement supprimée."
          : `Vous êtes sur le point de supprimer ${selectedRows.length} affectation(s). Cette action est irréversible.`
        }
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
