import { useState, useCallback } from "react";

export function useDeleteConfirm({ deleteFn, onBulkSuccess }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleDeleteClick = useCallback((id) => {
    setDeleteTargetId(id);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTargetId) {
      deleteFn(deleteTargetId, {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setDeleteTargetId(null);
        },
      });
    }
  }, [deleteTargetId, deleteFn]);

  const handleBulkDelete = useCallback(() => {
    setDeleteTargetId(null);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmBulkDelete = useCallback(() => {
    selectedRows.forEach((row) => deleteFn(row.id));
    setIsConfirmOpen(false);
    setSelectedRows([]);
    onBulkSuccess?.();
  }, [selectedRows, deleteFn, onBulkSuccess]);

  const closeConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setDeleteTargetId(null);
  }, []);

  return {
    selectedRows,
    setSelectedRows,
    isConfirmOpen,
    deleteTargetId,
    handleDeleteClick,
    handleConfirmDelete,
    handleBulkDelete,
    handleConfirmBulkDelete,
    closeConfirm,
  };
}
