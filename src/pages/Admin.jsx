import { useState } from "react";
import { Plus, X, Save, Loader2 } from "lucide-react";
import { useNews } from "../features/news/useNews";
import { useCreateNews, useUpdateNews, useDeleteNews } from "../features/news/useNewsMutations";
import { useUser } from "../features/auth/useUser";
import { NEWS_CATEGORIES } from "../styles/newsConstants";
import Button from "../ui/components/Button";
import Spinner from "../ui/components/Spinner";
import Input from "../ui/components/Input";
import Select from "../ui/components/Select";
import Modal from "../ui/components/Modal";
import NewsTableRow from "../features/admin/NewsTableRow";

const emptyNews = {
  title: "",
  content: "",
  image_url: "",
  category: "Administrative",
};

export default function Admin() {
  const { news, isLoading } = useNews();
  const { createNews, isCreating } = useCreateNews();
  const { updateNews, isUpdating } = useUpdateNews();
  const { deleteNews, isDeleting } = useDeleteNews();
  const { user } = useUser();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(emptyNews);
  const [isAnonymous, setIsAnonymous] = useState(false);

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestion des Actualités
        </h1>
        <div className="flex items-center justify-end">
          <Button onClick={openCreateModal} icon={Plus}>
            Ajouter
          </Button>
        </div>
      </div>

      <div className="overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-white/10">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Titre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Catégorie</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Date</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {news.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  Aucune actualité pour le moment
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <NewsTableRow 
                  key={item.id} 
                  item={item} 
                  onEdit={openEditModal} 
                  onDelete={deleteNews}
                  isDeleting={isDeleting}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

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

          <Input
            label="Image de couverture (URL)"
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contenu</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            />
          </div>

          {!editingNews && (
            <div className="flex items-center justify-between p-4 rounded-xl  dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Publier anonymement</label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">L'auteur sera affiché comme "Anonyme"</p>
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
    </div>
  );
}
