import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import {
  ArrowLeft,
  Save,
  Share2,
  Users,
  Maximize,
  Minimize,
  Loader2,
  ShieldX,
  Home,
} from "lucide-react";
import { useUser } from "../features/auth/useUser";
import { useWhiteboard, useUpdateWhiteboard } from "../features/whiteboard/useWhiteboards";
import { useCollaboration } from "../features/whiteboard/useCollaboration";
import ShareWhiteboardModal from "../features/whiteboard/ShareWhiteboardModal";
import Spinner from "../ui/components/Spinner";
import { toast } from "react-toastify";

export default function WhiteboardEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: board, isLoading, error } = useWhiteboard(id);
  const updateWhiteboard = useUpdateWhiteboard();

  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPresence, setShowPresence] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const titleInputRef = useRef(null);
  const isLoadingSnapshot = useRef(false);

  const currentUser = user
    ? {
        id: user.id,
        full_name: user.profile_full_name || user.user_metadata?.full_name || "Anonyme",
        avatar_url:
          user.profile_avatar_url || user.user_metadata?.avatar_url || "/image.png",
      }
    : null;

  const { onlineUsers, broadcastChanges, isRemoteUpdate } = useCollaboration(
    id,
    currentUser,
    editor
  );

  const isOwner = board?.owner_id === user?.id;
  const canEdit =
    isOwner ||
    board?.is_public ||
    board?.whiteboard_collaborators?.some(
      (c) => c.user_id === user?.id && c.role === "editor"
    );

  useEffect(() => {
    if (!editor || !board?.data) return;
    const snapshot = board.data;
    if (snapshot && Object.keys(snapshot).length > 0) {
      try {
        isLoadingSnapshot.current = true;
        editor.store.loadStoreSnapshot(snapshot);
      } catch {
      } finally {
        isLoadingSnapshot.current = false;
      }
    }
  }, [editor, board?.id]);

  // ---- Listen for store changes → broadcast + mark unsaved ----
  useEffect(() => {
    if (!editor) return;

    const removeListener = editor.store.listen(
      (entry) => {
        if (isRemoteUpdate.current) return;
        if (isLoadingSnapshot.current) return;
        if (entry.source !== "user") return;
        setHasUnsaved(true);
        broadcastChanges(entry.changes);
      },
      { source: "user", scope: "document" }
    );

    return removeListener;
  }, [editor, broadcastChanges, isRemoteUpdate]);

  // ---- Save ----
  const handleSave = useCallback(async () => {
    if (!editor || !id || isSaving) return;
    setIsSaving(true);
    try {
      const snapshot = editor.store.getStoreSnapshot();
      await updateWhiteboard.mutateAsync({ id, data: snapshot });
      setHasUnsaved(false);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  }, [editor, id, updateWhiteboard, isSaving]);

  // ---- Auto-save every 30s if there are unsaved changes ----
  useEffect(() => {
    if (!hasUnsaved || !editor) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 30000);

    return () => clearTimeout(timer);
  }, [hasUnsaved, editor, handleSave]);

  // ---- Save on Ctrl+S ----
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  // ---- Fullscreen ----
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      editorRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ---- Loading / Error states ----
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Spinner />
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
          
          <div className="relative p-8 text-center border rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-slate-200 dark:border-zinc-700 shadow-2xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <ShieldX className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
              Accès non autorisé
            </h2>
            
            <p className="mb-6 text-slate-500 dark:text-zinc-400 leading-relaxed">
              Ce tableau n'existe pas ou vous n'avez pas l'autorisation d'y accéder. 
              Demandez au propriétaire de vous ajouter comme collaborateur.
            </p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-zinc-600 to-transparent" />
              <span className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wide">
                ou
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-zinc-600 to-transparent" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/tableaux")}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <ArrowLeft className="w-4 h-4" />
                Mes tableaux
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors rounded-xl border-2 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
              >
                <Home className="w-4 h-4" />
                Accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={editorRef} className="flex flex-col h-[calc(100vh-64px)] bg-white dark:bg-zinc-950 z-50">
      <div className="flex items-center justify-between px-3 py-2 border-b shrink-0 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/tableaux")}
            className="p-2 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
          </button>
          
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={() => {
                const trimmed = titleValue.trim();
                if (trimmed && trimmed !== board.title) {
                  updateWhiteboard.mutate({ id: board.id, title: trimmed });
                }
                setIsEditingTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.target.blur();
                } else if (e.key === "Escape") {
                  setTitleValue(board.title);
                  setIsEditingTitle(false);
                }
              }}
              className="px-2 py-1 text-base font-semibold bg-transparent border-2 border-purple-500 rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-none min-w-[120px]"
            />
          ) : (
            <h1
              onClick={() => {
                if (isOwner) {
                  setTitleValue(board.title);
                  setIsEditingTitle(true);
                  setTimeout(() => titleInputRef.current?.focus(), 0);
                }
              }}
              className={`text-base font-semibold truncate text-slate-900 dark:text-zinc-100 ${
                isOwner ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 px-2 py-1 rounded-lg transition-colors" : ""
              }`}
              title={isOwner ? "Cliquez pour renommer" : undefined}
            >
              {board.title}
            </h1>
          )}
          
          {hasUnsaved && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              Non enregistré
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPresence((v) => !v)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
          >
            <Users className="w-4 h-4" />
            <span>{onlineUsers.length + 1}</span>
            {onlineUsers.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>

          {isOwner && (
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Partager</span>
            </button>
          )}

          {canEdit && (
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsaved}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isSaving ? "Sauvegarde..." : "Enregistrer"}
              </span>
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            ) : (
              <Maximize className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0">
        {/* Tldraw canvas */}
        <div className="flex-1">
          <Tldraw
            autoFocus
            onMount={(editorInstance) => setEditor(editorInstance)}
            options={canEdit ? undefined : { readonly: true }}
          />
        </div>

        {/* Presence sidebar */}
        {showPresence && (
          <div className="absolute right-0 top-0 z-20 w-64 h-full bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-xl overflow-y-auto">
            <div className="p-4">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                En ligne ({onlineUsers.length + 1})
              </h3>

              {/* Current user */}
              <div className="flex items-center gap-3 p-2 mb-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="relative">
                  <img
                    src={currentUser?.avatar_url || "/image.png"}
                    alt="Moi"
                    className="object-cover w-8 h-8 rounded-full"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src = "/image.png";
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-slate-900 dark:text-zinc-100">
                    {currentUser?.full_name} (Moi)
                  </p>
                </div>
              </div>

              {/* Other users */}
              {onlineUsers.map((u) => (
                <div
                  key={u.user_id}
                  className="flex items-center gap-3 p-2 mb-1 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  <div className="relative">
                    <img
                      src={u.avatar_url || "/image.png"}
                      alt={u.full_name}
                      className="object-cover w-8 h-8 rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.src = "/image.png";
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-slate-900 dark:text-zinc-100">
                      {u.full_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">En ligne</p>
                  </div>
                </div>
              ))}

              {onlineUsers.length === 0 && (
                <p className="text-sm text-center text-slate-400 dark:text-zinc-600 py-4">
                  Personne d'autre en ligne
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share modal */}
      <ShareWhiteboardModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        board={board}
      />
    </div>
  );
}
