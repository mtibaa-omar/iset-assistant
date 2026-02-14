import { useMemo, useRef, useCallback } from "react";

import { Plus, Save, Loader2, Trash2, FilterX } from "lucide-react";
import { useUnites } from "../features/admin/useUnites";
import {
  useCreateUnite,
  useUpdateUnite,
  useDeleteUnite,
} from "../features/admin/useUnitesMutations";
import { useLevels } from "../features/admin/useLevels";
import { useSpecialties } from "../features/admin/useSpecialties";
import { useAdminFilters } from "../features/admin/hooks/useAdminFilters";
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

const emptyUnite = {
  name: "",
  code: "",
};

export default function AdminUnites() {
  const gridRef = useRef(null);
  const { unites, isLoading } = useUnites();
  const { levels, isLoading: isLevelsLoading } = useLevels();
  const { specialties, isLoading: isSpecialtiesLoading } = useSpecialties();
  const { createUnite, isCreating } = useCreateUnite();
  const { updateUnite, isUpdating } = useUpdateUnite();
  const { deleteUnite, isDeleting } = useDeleteUnite();

  const {
    isModalOpen,
    editingItem: editingUnite,
    formData,
    setFormData,
    openCreateModal,
    openEditModal: openEditModalBase,
    closeModal,
  } = useAdminModal({ defaultValues: emptyUnite });

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
  } = useDeleteConfirm({ deleteFn: deleteUnite });
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
  } = useAdminFilters({ levels, specialties, data: unites });

  const unitesWithComputedFields = useMemo(() => {
    return unites.map((u) => {
      const uniqueSpecialties = new Map();
      u.program_subjects?.forEach(ps => {
        if (ps.specialties) {
          uniqueSpecialties.set(ps.specialties.id, ps.specialties);
        }
      });
      
      const specialtiesList = Array.from(uniqueSpecialties.values())
        .map(spec => `${spec.name} (${spec.degree === 'licence' ? 'L' : 'M'})`)
        .join(', ');
      
      return {
        ...u,
        specialties_list: specialtiesList || "-",
      };
    });
  }, [unites]);

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
        field: "code",
        headerName: "Code",
        width: 100,
        filter: true,
        sortable: true,
        valueFormatter: (params) => params.value || "-",
      },
      {
        field: "specialties_list",
        headerName: "Spécialités",
        flex: 1,
        filter: true,
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
  }, [setSelectedRows]);
  const context = useMemo(
    () => ({
      onEdit: openEditModal,
      onDelete: handleDeleteClick,
      isDeleting,
    }),
    [isDeleting, handleDeleteClick],
  );

  function openEditModal(unite) {
    openEditModalBase(unite, (u) => ({
      name: u.name || "",
      code: u.code || "",
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingUnite) {
      updateUnite(
        { id: editingUnite.id, data: formData },
        { onSuccess: closeModal },
      );
    } else {
      createUnite(formData, { onSuccess: closeModal });
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
    <div className="px-6 pt-0 pb-6 space-y-6 md:py-6 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
          Gestion des Unités
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
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
        rowData={unitesWithComputedFields}
        columnDefs={columnDefs}
        onSelectionChanged={onSelectionChanged}
        context={context}
        doesExternalFilterPass={doesExternalFilterPass}
        isExternalFilterPresent={isExternalFilterPresent}
        noRowsMessage={
          hasActiveFilters
            ? "Aucune unité correspondant aux filtres"
            : "Aucune unité pour le moment"
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUnite ? "Modifier l'unité" : "Nouvelle unité"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nom"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            autoFocus
            placeholder="Ex: UE Fondamentale"
          />

          <Input
            label="Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Ex: UEF"
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
              {editingUnite ? "Modifier" : "Créer"}
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
            ? "Supprimer cette unité ?"
            : `Supprimer ${selectedRows.length} unité(s) ?`
        }
        message={
          deleteTargetId
            ? "Cette action est irréversible. L'unité sera définitivement supprimée."
            : `Vous êtes sur le point de supprimer ${selectedRows.length} unité(s). Cette action est irréversible.`
        }
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
