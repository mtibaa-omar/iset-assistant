import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PenTool } from "lucide-react";
import { useUser } from "../features/auth/useUser";
import {
  useWhiteboards,
  useCreateWhiteboard,
  useDeleteWhiteboard,
} from "../features/whiteboard/useWhiteboards";
import Button from "../ui/components/Button";
import Confirm from "../ui/components/Confirm";
import Spinner from "../ui/components/Spinner";
import WhiteboardCard from "../features/whiteboard/WhiteboardCard";
import ShareWhiteboardModal from "../features/whiteboard/ShareWhiteboardModal";

export default function WhiteboardsPage() {
  const { user, isLoading: userLoading } = useUser();
  const userId = user?.id;
  const navigate = useNavigate();

  const { data: whiteboards = [], isLoading } = useWhiteboards();
  const createWhiteboard = useCreateWhiteboard(userId);
  const deleteWhiteboard = useDeleteWhiteboard();

  const [shareBoard, setShareBoard] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });
  const handleCreate = () => {
    createWhiteboard.mutate("Sans titre", {
      onSuccess: (wb) => navigate(`/tableaux/${wb.id}`),
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm.id) return;
    deleteWhiteboard.mutate(deleteConfirm.id, {
      onSuccess: () => setDeleteConfirm({ isOpen: false, id: null }),
    });
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                Tableau 
              </h1>
            </div>
            <p className="font-medium text-slate-500 dark:text-zinc-500 pl-14">
              Dessinez et collaborez en temps réel
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleCreate}
            isLoading={createWhiteboard.isPending}
            loadingText="Création..."
          >
            Nouveau tableau
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Spinner />
            <p className="font-medium text-slate-500 dark:text-zinc-500">
              Chargement de vos tableaux...
            </p>
          </div>
        ) : whiteboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center border-2 border-dashed bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-center w-24 h-24 mb-6 shadow-sm bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl">
              <PenTool className="w-12 h-12 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
              Prêt à dessiner ?
            </h3>
            <p className="max-w-md mb-8 leading-relaxed text-slate-500 dark:text-zinc-500">
              Créez votre premier tableau blanc et laissez vos idées prendre forme. Dessinez,
              schématisez et collaborez librement !
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={Plus}
              onClick={handleCreate}
              isLoading={createWhiteboard.isPending}
            >
              Créer mon premier tableau
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whiteboards.map((wb) => (
              <WhiteboardCard
                key={wb.id}
                board={wb}
                currentUserId={userId}
                onShare={(w) => setShareBoard(w)}
                onDelete={(w) => setDeleteConfirm({ isOpen: true, id: w.id })}
              />
            ))}
          </div>
        )}
      </div>

      <ShareWhiteboardModal
        isOpen={!!shareBoard}
        onClose={() => setShareBoard(null)}
        board={shareBoard}
      />

      <Confirm
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        isLoading={deleteWhiteboard.isPending}
        variant="delete"
        title="Supprimer le tableau"
        message="Êtes-vous sûr de vouloir supprimer ce tableau ? Cette action est irréversible."
        confirmText="Supprimer"
      />
    </div>
  );
}
