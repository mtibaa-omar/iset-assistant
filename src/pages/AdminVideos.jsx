import { useMemo, useRef, useCallback } from "react";
import { Plus, Save, Loader2, Trash2, FilterX, Video as VideoIcon } from "lucide-react";
import { useVideos } from "../features/admin/useVideos";
import { useCreateVideo, useUpdateVideo, useDeleteVideo } from "../features/admin/useVideosMutations";
import { useLevels } from "../features/admin/useLevels";
import { useSpecialties } from "../features/admin/useSpecialties";
import { useAdminFilters, formatDateShortFR } from "../features/admin/hooks/useAdminFilters";
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

const emptyVideo = {
  title: "",
  video_url: "",
  description: "",
  specialty_id: "",
  level_id: "",
};

// Helper function to get video thumbnail from URL
const getVideoThumbnail = (url) => {
  if (!url) return null;
  
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    // Note: Vimeo thumbnails require API call, using placeholder
    return null;
  }
  
  return null;
};

// Video Thumbnail Cell Renderer
const VideoThumbnailCellRenderer = (params) => {
  const thumbnail = getVideoThumbnail(params.value);
  
  if (thumbnail) {
    return (
      <div className="flex items-center h-full">
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="object-cover w-16 h-12 border rounded-lg border-slate-200 dark:border-zinc-700"
        />
      </div>
    );
  }
  
  return (
    <div className="flex items-center h-full">
      <div className="flex items-center justify-center w-16 h-12 border border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
        <VideoIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      </div>
    </div>
  );
};

// Video URL Cell Renderer
const VideoUrlCellRenderer = (params) => {
  if (!params.value) return <span className="text-slate-400">-</span>;
  
  return (
    <a
      href={params.value}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-xs text-sm text-purple-600 underline truncate hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
      onClick={(e) => e.stopPropagation()}
    >
      {params.value}
    </a>
  );
};

export default function AdminVideos() {
  const gridRef = useRef(null);
  const { videos, isLoading } = useVideos();
  const { levels, isLoading: isLevelsLoading } = useLevels();
  const { specialties, isLoading: isSpecialtiesLoading } = useSpecialties();
  const { createVideo, isCreating } = useCreateVideo();
  const { updateVideo, isUpdating } = useUpdateVideo();
  const { deleteVideo, isDeleting } = useDeleteVideo();
  
  const {
    isModalOpen,
    editingItem: editingVideo,
    formData,
    setFormData,
    openCreateModal,
    openEditModal: openEditModalBase,
    closeModal,
  } = useAdminModal({ defaultValues: emptyVideo });

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
  } = useDeleteConfirm({ deleteFn: deleteVideo });

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
  } = useAdminFilters({ levels, specialties, data: videos });

  const specialtyFormOptions = useMemo(() => [
    { value: "", label: "Aucune spécialité" },
    ...specialties.map(s => ({ value: s.id, label: `${s.name} (${s.degree === 'licence' ? 'L' : 'M'})` }))
  ], [specialties]);

  const levelFormOptions = useMemo(() => [
    { value: "", label: "Aucun niveau" },
    ...levels.map(l => {
      const degree = l.code?.toUpperCase().startsWith('L') ? ' (L)' : 
                     l.code?.toUpperCase().startsWith('M') ? ' (M)' : '';
      return { value: l.id, label: l.name + degree };
    })
  ], [levels]);

  const videosWithComputedFields = useMemo(() => {
    return videos.map(v => ({
      ...v,
      specialty_name: v.specialties?.name ? 
        `${v.specialties.name} (${v.specialties.degree === 'licence' ? 'L' : 'M'})` : "-",
      level_name: v.levels?.name ?
        `${v.levels.name} (${v.levels.code?.toUpperCase().startsWith('L') ? 'L' : 'M'})` : "-",
      formatted_date: formatDateShortFR(v.created_at),
    }));
  }, [videos]);

  const columnDefs = useMemo(() => [
    { 
      field: "video_url",
      headerName: "Aperçu", 
      width: 100,
      cellRenderer: VideoThumbnailCellRenderer,
      sortable: false,
      filter: false,
    },
    { 
      field: "title", 
      headerName: "Titre", 
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
      width: 120,
      filter: true,
      sortable: true,
    },
    { 
      field: "video_url", 
      headerName: "Lien", 
      flex: 1,
      cellRenderer: VideoUrlCellRenderer,
      sortable: false,
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
  ], []);

  const context = useMemo(() => ({
    onEdit: openEditModal,
    onDelete: handleDeleteClick,
    isDeleting,
  }), [isDeleting, handleDeleteClick]);

  function openEditModal(video) {
    openEditModalBase(video, (v) => ({
      title: v.title,
      video_url: v.video_url,
      description: v.description || "",
      specialty_id: v.specialty_id || "",
      level_id: v.level_id || "",
    }));
  }

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current?.api?.getSelectedRows() || [];
    setSelectedRows(selectedNodes);
  }, [setSelectedRows]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const videoData = {
      title: formData.title,
      video_url: formData.video_url,
      description: formData.description || null,
      specialty_id: formData.specialty_id || null,
      level_id: formData.level_id || null,
    };

    if (editingVideo) {
      updateVideo(
        { id: editingVideo.id, data: videoData },
        { onSuccess: closeModal }
      );
    } else {
      createVideo(videoData, { onSuccess: closeModal });
    }
  };

  if (isLoading || isLevelsLoading || isSpecialtiesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Vidéos
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            Gérer les vidéos éducatives
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filterDegree}
          onChange={(e) => handleDegreeChange(e.target.value)}
          options={degreeOptions}
        />
        <Select
          value={filterLevel}
          onChange={(e) => handleLevelChange(e.target.value)}
          options={levelOptions}
        />
        <Select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          options={specialtyOptions} className="max-w-50"
        />
        {hasActiveFilters && (
          <Button variant="secondary" onClick={resetFilters}>
            <FilterX className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        )}
        <div className="flex-1" />
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une vidéo
        </Button>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 p-4 border border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
            {selectedRows.length} vidéo(s) sélectionnée(s)
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer la sélection
              </>
            )}
          </Button>
        </div>
      )}

      <AdminTable
        ref={gridRef}
        rowData={videosWithComputedFields}
        columnDefs={columnDefs}
        onSelectionChanged={onSelectionChanged}
        context={context}
        doesExternalFilterPass={doesExternalFilterPass}
        isExternalFilterPresent={isExternalFilterPresent}
        noRowsMessage={hasActiveFilters ? "Aucune vidéo correspondant aux filtres" : "Aucune vidéo pour le moment"}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVideo ? "Modifier la vidéo" : "Ajouter une vidéo"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <Input
            label="URL de la vidéo"
            type="url"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-zinc-300">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white border rounded-lg border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent"
              placeholder="Brève description de la vidéo..."
            />
          </div>

          <Select
            label="Spécialité (optionnel)"
            value={formData.specialty_id}
            onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
            options={specialtyFormOptions}
          />

          <Select
            label="Niveau (optionnel)"
            value={formData.level_id}
            onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
            options={levelFormOptions}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Annuler
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingVideo ? "Modification..." : "Création..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingVideo ? "Modifier" : "Créer"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Confirm
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={deleteTargetId ? handleConfirmDelete : handleConfirmBulkDelete}
        isLoading={isDeleting}
        variant="danger"
        title="Supprimer la vidéo"
        message="Êtes-vous sûr de vouloir supprimer cette vidéo ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
