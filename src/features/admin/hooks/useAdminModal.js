import { useState, useCallback } from "react";

export function useAdminModal({ defaultValues, onReset }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(defaultValues);

  const openCreateModal = useCallback(() => {
    setEditingItem(null);
    setFormData(defaultValues);
    onReset?.();
    setIsModalOpen(true);
  }, [defaultValues, onReset]);

  const openEditModal = useCallback((item, mapToForm) => {
    setEditingItem(item);
    setFormData(mapToForm ? mapToForm(item) : item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(defaultValues);
    onReset?.();
  }, [defaultValues, onReset]);

  return {
    isModalOpen,
    editingItem,
    formData,
    setFormData,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}
