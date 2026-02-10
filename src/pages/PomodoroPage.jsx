import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Timer } from "lucide-react";
import { useUser } from "../features/auth/useUser";
import {
  usePomodoroSessions,
  useCreatePomodoro,
  useDeletePomodoro,
} from "../features/pomodoro/usePomodoro";
import Button from "../ui/components/Button";
import Confirm from "../ui/components/Confirm";
import Spinner from "../ui/components/Spinner";
import PomodoroCard from "../features/pomodoro/PomodoroCard";
import SharePomodoroModal from "../features/pomodoro/SharePomodoroModal";

export default function PomodoroPage() {
  const { user, isLoading: userLoading } = useUser();
  const userId = user?.id;
  const navigate = useNavigate();

  const { data: sessions = [], isLoading } = usePomodoroSessions();
  const createPomodoro = useCreatePomodoro(userId);
  const deletePomodoro = useDeletePomodoro();

  const [shareSession, setShareSession] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
  });

  const handleCreate = () => {
    createPomodoro.mutate(
      { title: "Session Pomodoro" },
      {
        onSuccess: (session) => navigate(`/pomodoro/${session.id}`),
      }
    );
  };

  const handleDelete = () => {
    if (!deleteConfirm.id) return;
    deletePomodoro.mutate(deleteConfirm.id, {
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
                <Timer className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                Pomodoro
              </h1>
            </div>
            <p className="font-medium text-slate-500 dark:text-zinc-500 pl-14">
              Concentrez-vous et collaborez en temps réel
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleCreate}
            isLoading={createPomodoro.isPending}
            loadingText="Création..."
          >
            Nouvelle session
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Spinner />
            <p className="font-medium text-slate-500 dark:text-zinc-500">
              Chargement de vos sessions...
            </p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center border-2 border-dashed bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-center w-24 h-24 mb-6 shadow-sm bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl">
              <Timer className="w-12 h-12 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
              Prêt à vous concentrer ?
            </h3>
            <p className="max-w-md mb-8 leading-relaxed text-slate-500 dark:text-zinc-500">
              Créez votre première session Pomodoro et boostez votre
              productivité. Invitez vos amis pour étudier ensemble !
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={Plus}
              onClick={handleCreate}
              isLoading={createPomodoro.isPending}
            >
              Créer ma première session
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <PomodoroCard
                key={session.id}
                session={session}
                currentUserId={userId}
                onShare={(s) => setShareSession(s)}
                onDelete={(s) =>
                  setDeleteConfirm({ isOpen: true, id: s.id })
                }
              />
            ))}
          </div>
        )}
      </div>

      <SharePomodoroModal
        isOpen={!!shareSession}
        onClose={() => setShareSession(null)}
        session={shareSession}
      />

      <Confirm
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        isLoading={deletePomodoro.isPending}
        variant="delete"
        title="Supprimer la session"
        message="Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible."
        confirmText="Supprimer"
      />
    </div>
  );
}
