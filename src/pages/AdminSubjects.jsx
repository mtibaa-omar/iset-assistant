import { useState, useMemo, useRef, useCallback } from "react";

import { Plus, Save, Loader2, Trash2, FilterX } from "lucide-react";
import { useSubjectsAdmin } from "../features/admin/useSubjectsAdmin";
import {
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from "../features/admin/useSubjectsMutations";
import { useDepartments } from "../features/admin/useDepartments";
import { useLevels } from "../features/admin/useLevels";
import { useSpecialties } from "../features/admin/useSpecialties";
import {
  useAdminFilters,
  formatDateShortFR,
} from "../features/admin/hooks/useAdminFilters";
import { useDeleteConfirm } from "../features/admin/hooks/useDeleteConfirm";
import { useAdminModal } from "../features/admin/hooks/useAdminModal";
import AdminTable from "../features/admin/components/AdminTable";
import ActionsCellRenderer from "../features/admin/components/ActionsCellRenderer";
import Button from "../ui/components/Button";
import Spinner from "../ui/components/Spinner";
import Input from "../ui/components/Input";
import Select from "../ui/components/Select";
import Modal from "../ui/components/Modal";
import Confirm from "../ui/components/Confirm";

const emptySubject = {
  name: "",
  department_id: "",
};

export default function AdminSubjects() {
  const gridRef = useRef(null);
  const { subjects, isLoading } = useSubjectsAdmin();
  const { departments, isLoading: isDepartmentsLoading } = useDepartments();
  const { levels, isLoading: isLevelsLoading } = useLevels();
  const { specialties, isLoading: isSpecialtiesLoading } = useSpecialties();
  const { createSubject, isCreating } = useCreateSubject();
  const { updateSubject, isUpdating } = useUpdateSubject();
  const { deleteSubject, isDeleting } = useDeleteSubject();

  const {
    isModalOpen,
    editingItem: editingSubject,
    formData,
    setFormData,
    openCreateModal,
    openEditModal: openEditModalBase,
    closeModal,
  } = useAdminModal({ defaultValues: emptySubject });

  const {
    selectedRows,
    setSelectedRows,
    isConfirmOpen,
    deleteTargetId,
    handleDeleteClick,
    handleConfirmDelete,
    handleBulkDelete,
    handleConfirmBulkDelete,
    closeConfirm,
  } = useDeleteConfirm({ deleteFn: deleteSubject });
  const {
    filterDegree,
    filterLevel,
    filterSpecialty,
    filterDepartment,
    setFilterDepartment,
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
  } = useAdminFilters({ levels, specialties, data: subjects });

  const departmentOptions = useMemo(
    () => [
      { value: "all", label: "Tous les départements" },
      ...departments.map((dept) => ({ value: dept.id, label: dept.name })),
    ],
    [departments],
  );

  const departmentFormOptions = useMemo(
    () => departments.map((dept) => ({ value: dept.id, label: dept.name })),
    [departments],
  );

  const subjectsWithComputedFields = useMemo(() => {
    return subjects.map((s) => {
      const uniqueSpecialties = new Map();
      s.program_subjects?.forEach(ps => {
        if (ps.specialties) {
          uniqueSpecialties.set(ps.specialties.id, ps.specialties);
        }
      });
      
      const specialtiesList = Array.from(uniqueSpecialties.values())
        .map(spec => `${spec.name} (${spec.degree === 'licence' ? 'L' : 'M'})`)
        .join(', ');
      
      return {
        ...s,
        department_name: s.departments?.name || "-",
        specialties_list: specialtiesList || "-",
        formatted_date: formatDateShortFR(s.created_at),
      };
    });
  }, [subjects]);

  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nom",
        flex: 2,
        filter: true,
        sortable: true,
      },
      {
        field: "department_name",
        headerName: "Département",
        width: 140,
        filter: true,
        sortable: true,
      },
      {
        field: "specialties_list",
        headerName: "Spécialités",
        flex: 1,
        filter: true,
        sortable: true,
      },
      {
        field: "formatted_date",
        headerName: "Date",
        width: 100,
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
    ],
    [],
  );

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current?.api?.getSelectedNodes() || [];
    setSelectedRows(selectedNodes.map((node) => node.data));
  }, []);
  const context = useMemo(
    () => ({
      onEdit: openEditModal,
      onDelete: handleDeleteClick,
      isDeleting,
    }),
    [isDeleting],
  );

  function openEditModal(subject) {
    openEditModalBase(subject, (s) => ({
      name: s.name || "",
      department_id: s.departments?.id || "",
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingSubject) {
      updateSubject(
        { id: editingSubject.id, data: formData },
        { onSuccess: closeModal },
      );
    } else {
      createSubject(formData, { onSuccess: closeModal });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-6 pt-0 pb-6 space-y-6 md:py-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
          Gestion des Matières
        </h1>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-48">
              <Select
                label=""
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                options={departmentOptions}
                disabled={isDepartmentsLoading}
              />
            </div>
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
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
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
        rowData={subjectsWithComputedFields}
        columnDefs={columnDefs}
        onSelectionChanged={onSelectionChanged}
        context={context}
        doesExternalFilterPass={doesExternalFilterPass}
        isExternalFilterPresent={isExternalFilterPresent}
        noRowsMessage={
          hasActiveFilters
            ? "Aucune matière correspondant aux filtres"
            : "Aucune matière pour le moment"
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSubject ? "Modifier la matière" : "Nouvelle matière"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            autoFocus
            placeholder="Ex: Programmation Web"
          />

          <Select
            label="Département"
            value={formData.department_id}
            onChange={(e) =>
              setFormData({ ...formData, department_id: e.target.value })
            }
            options={departmentFormOptions}
            required
            disabled={isDepartmentsLoading}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={closeModal}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingSubject ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      <Confirm
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={
          deleteTargetId ? handleConfirmDelete : handleConfirmBulkDelete
        }
        isLoading={isDeleting}
        variant="danger"
        title={
          deleteTargetId
            ? "Supprimer cette matière ?"
            : `Supprimer ${selectedRows.length} matière(s) ?`
        }
        message={
          deleteTargetId
            ? "Cette action est irréversible. La matière sera définitivement supprimée."
            : `Vous êtes sur le point de supprimer ${selectedRows.length} matière(s). Cette action est irréversible.`
        }
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
