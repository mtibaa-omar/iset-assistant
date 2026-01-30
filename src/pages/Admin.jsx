import { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Plus, X, Save, Loader2, Trash2, Search, Edit2, FilterX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNews } from "../features/news/useNews";
import { useCreateNews, useUpdateNews, useDeleteNews } from "../features/news/useNewsMutations";
import { useUser } from "../features/auth/useUser";
import { NEWS_CATEGORIES } from "../styles/newsConstants";
import Button from "../ui/components/Button";
import Spinner from "../ui/components/Spinner";
import Input from "../ui/components/Input";
import Select from "../ui/components/Select";
import Modal from "../ui/components/Modal";
import Confirm from "../ui/components/Confirm";
import { useDarkMode } from "../context/DarkModeContext";

const emptyNews = {
  title: "",
  content: "",
  image_url: "",
  category: "Administrative",
  status: "published",
};

const DATE_FILTERS = {
  all: { label: "Toutes les dates", getValue: () => null },
  week: { label: "Cette semaine", getValue: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  month: { label: "Ce mois", getValue: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  quarter: { label: "3 derniers mois", getValue: () => new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
};

const ImageCellRenderer = (params) => {
  if (params.value) {
    return (
      <div className="flex items-center h-full">
        <img
          src={params.value}
          alt="News"
          className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-zinc-700"
        />
      </div>
    );
  }
  return (
    <div className="flex items-center h-full">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
        <span className="text-xs text-slate-400 dark:text-zinc-500">N/A</span>
      </div>
    </div>
  );
};

const StatusBadgeCellRenderer = (params) => {
  const status = params.value || "published";
  if (status === "draft") {
    return (
      <div className="flex items-center h-full">
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          Brouillon
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center h-full">
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        Publié
      </span>
    </div>
  );
};

const ViewsCellRenderer = (params) => {
  return (
    <div className="flex items-center h-full">
      <span className="text-sm text-slate-600 dark:text-zinc-400">{params.value || 0}</span>
    </div>
  );
};

const ActionsCellRenderer = (params) => {
  const { onEdit, onDelete, isDeleting } = params.context;
  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <button
        onClick={() => onEdit(params.data)}
        className="p-1.5 text-purple-600 transition-colors rounded hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
        title="Modifier"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(params.data.id)}
        disabled={isDeleting}
        className="p-1.5 text-red-600 transition-colors rounded hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Admin() {
  const gridRef = useRef(null);
  const { news, isLoading } = useNews();
  const { createNews, isCreating } = useCreateNews();
  const { updateNews, isUpdating } = useUpdateNews();
  const { deleteNews, isDeleting } = useDeleteNews();
  const { user } = useUser();
  const { isDarkMode } = useDarkMode();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(emptyNews);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [selectedRows, setSelectedRows] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === "all" || item.category === filterCategory;
      
      const dateThreshold = DATE_FILTERS[filterDate]?.getValue();
      const matchesDate = !dateThreshold || 
        new Date(item.published_at || item.created_at) >= dateThreshold;
      
      const matchesStatus = filterStatus === "all" || 
        (item.status || "published") === filterStatus;
      
      return matchesSearch && matchesCategory && matchesDate && matchesStatus;
    }).map(item => ({
      ...item,
      formatted_date: formatDate(item.published_at || item.created_at)
    }));
  }, [news, searchQuery, filterCategory, filterDate, filterStatus]);

  

  const openCreateModal = () => {
    setEditingNews(null);
    setFormData(emptyNews);
    setIsAnonymous(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title || "",
      content: item.content || "",
      image_url: item.image_url || "",
      category: item.category || "Administrative",
      status: item.status || "published",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setFormData(emptyNews);
    setIsAnonymous(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const authorData = editingNews ? {} : isAnonymous ? {
      author_name: "Anonyme",
      author_avatar_url: "/default-user.jpg",
    } : {
      author_name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
      author_avatar_url: user?.user_metadata?.avatar_url || "",
    };

    const newsData = {
      ...formData,
      ...authorData,
      published_at: new Date().toISOString().split('T')[0],
    };
    
    if (editingNews) {
      updateNews({ id: editingNews.id, data: newsData }, { onSuccess: closeModal });
    } else {
      createNews(newsData, { onSuccess: closeModal });
    }
  };

  const onSelectionChanged = () => {
    if (gridRef.current && gridRef.current.api) {
      const selectedNodes = gridRef.current.api.getSelectedRows();
      setSelectedRows(selectedNodes);
    }
  };

  const onDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    selectedRows.forEach(item => deleteNews(item.id));
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.deselectAll();
    }
    setSelectedRows([]);
    setIsConfirmOpen(false);
  };

  const onClearFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterDate("all");
    setFilterStatus("all");
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setFilterModel(null);
      gridRef.current.api.applyColumnState({
        defaultState: { sort: null },
      });
    }
  };

  const columnDefs = useMemo(() => [
    { 
      field: "image_url", 
      headerName: "Image", 
      cellRenderer: ImageCellRenderer,
      width: 100,
      sortable: false,
      filter: false,
    },
    { 
      field: "title", 
      headerName: "Titre", 
      flex: 2,
      minWidth: 200,
      filter: true,
      sortable: true,
    },
    { 
      field: "category", 
      headerName: "Catégorie", 
      flex: 1,
      minWidth: 120,
      filter: true,
      sortable: true,
    },
    { 
      field: "status", 
      headerName: "Status", 
      cellRenderer: StatusBadgeCellRenderer,
      width: 120,
      filter: true,
      sortable: true,
    },
    { 
      field: "views_count", 
      headerName: "Vues", 
      cellRenderer: ViewsCellRenderer,
      width: 100,
      sortable: true,
      filter: false,
    },
    { 
      field: "formatted_date", 
      headerName: "Date", 
      width: 120,
      sortable: true,
      filter: false,
    },
    { 
      headerName: "Actions", 
      field: "id",
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: "right",
      width: 120,
    },
  ], []);

  const rowSelection = useMemo(() => ({
    mode: "multiRow",
  }), []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
  }), []);

  const hasActiveFilters = searchQuery || filterCategory !== "all" || filterDate !== "all" || filterStatus !== "all";

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
          Gestion des Actualités
        </h1>
        
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 flex-1 sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par titre ou contenu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select
                label=""
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                options={[
                  { value: "all", label: "Toutes catégories" },
                  ...NEWS_CATEGORIES
                ]}
              />
            </div>
            
            <div className="w-full sm:w-44">
              <Select
                label=""
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                options={Object.entries(DATE_FILTERS).map(([key, { label }]) => ({
                  value: key,
                  label
                }))}
              />
            </div>
            
            <div className="w-full sm:w-40">
              <Select
                label=""
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "all", label: "Tous status" },
                  { value: "published", label: "Publié" },
                  { value: "draft", label: "Brouillon" }
                ]}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedRows.length > 0 && (
              <>
                <Button
                  variant="danger"
                  icon={Trash2}
                  onClick={onDeleteSelected}
                  className="flex items-center gap-2"
                >
                  Supprimer
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                    {selectedRows.length}
                  </span>
                </Button>
                <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
              </>
            )}

            {hasActiveFilters && (
              <>
                <Button
                  variant="secondary"
                  icon={FilterX}
                  onClick={onClearFilters}
                >
                  Réinitialiser
                </Button>
                <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
              </>
            )}
            
            <Button onClick={openCreateModal} icon={Plus}>
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden" style={{ height: '600px' }}>
        <div className={`${isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"} w-full h-full`}>
          <AgGridReact
            ref={gridRef}
            theme="legacy"
            rowData={filteredNews}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            onSelectionChanged={onSelectionChanged}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            context={{
              onEdit: openEditModal,
              onDelete: deleteNews,
              isDeleting
            }}
            noRowsOverlayComponent={() => (
              <span className="text-slate-500">
                {hasActiveFilters ? "Aucune actualité correspondant aux filtres" : "Aucune actualité pour le moment"}
              </span>
            )}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingNews ? "Modifier l'actualité" : "Nouvelle actualité"}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />

          <Select
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={NEWS_CATEGORIES}
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: "published", label: "Publié" },
              { value: "draft", label: "Brouillon" }
            ]}
          />

          <Input
            label="Image de couverture (URL)"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Contenu</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            />
          </div>

          {!editingNews && (
            <div className="flex items-center justify-between p-4 rounded-xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">Publier anonymement</label>
                <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">L'auteur sera affiché comme "Anonyme"</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isAnonymous ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnonymous ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

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
              {editingNews ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>

      <Confirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        variant="delete"
        title="Supprimer les actualités"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedRows.length} actualité(s) ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
