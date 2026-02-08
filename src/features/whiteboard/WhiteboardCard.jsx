import { MoreVertical, Pencil, Share2, Trash2, Globe, Lock, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateWhiteboard } from "./useWhiteboards";

export default function WhiteboardCard({ board, currentUserId, onShare, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(board.title);
  const menuRef = useRef(null);
  const renameRef = useRef(null);
  const updateWhiteboard = useUpdateWhiteboard();

  const isOwner = board.owner_id === currentUserId;
  const collaborators = board.whiteboard_collaborators || [];

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus rename input when entering rename mode
  useEffect(() => {
    if (isRenaming && renameRef.current) renameRef.current.focus();
  }, [isRenaming]);

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === board.title) {
      setIsRenaming(false);
      setRenameValue(board.title);
      return;
    }
    updateWhiteboard.mutate(
      { id: board.id, title: trimmed },
      { onSuccess: () => setIsRenaming(false) }
    );
  };

  const formattedDate = new Date(board.updated_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="group relative flex flex-col overflow-hidden transition-all duration-200 bg-white border-2 border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer"
      onClick={() => navigate(`/tableaux/${board.id}`)}
    >
      {/* Thumbnail  */}
      <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-zinc-800">
        {board.thumbnail_url ? (
          <img
            src={board.thumbnail_url}
            alt={board.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Pencil className="w-10 h-10 text-slate-300 dark:text-zinc-600" />
          </div>
        )}

        {/* Public / Private badge */}
        <span className="absolute flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg top-2 left-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-slate-600 dark:text-zinc-300">
          {board.is_public ? (
            <>
              <Globe className="w-3 h-3" /> Public
            </>
          ) : (
            <>
              <Lock className="w-3 h-3" /> Privé
            </>
          )}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <input
                  ref={renameRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit();
                    if (e.key === "Escape") { setIsRenaming(false); setRenameValue(board.title); }
                  }}
                  onBlur={handleRenameSubmit}
                  className="w-full px-2 py-0.5 text-sm font-semibold border-2 rounded-lg border-purple-500 bg-transparent text-slate-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            ) : (
              <>
                <h3 className="font-semibold truncate text-slate-900 dark:text-zinc-100">
                  {board.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-500">
                  {isOwner ? "Mon tableau" : `Par ${board.owner?.full_name}`} · {formattedDate}
                </p>
              </>
            )}
          </div>

          {/* Context menu */}
          {isOwner && (
            <div ref={menuRef} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((o) => !o);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 bottom-full mb-1 z-50 w-44 py-1 bg-white border rounded-xl dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 shadow-xl">
                  <MenuItem
                    icon={Pencil}
                    label="Renommer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setIsRenaming(true);
                    }}
                  />
                  <MenuItem
                    icon={Share2}
                    label="Partager"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onShare(board);
                    }}
                  />
                  <MenuItem
                    icon={Trash2}
                    label="Supprimer"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete(board);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collaborator avatars */}
        {collaborators.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {collaborators.slice(0, 4).map((c) => (
                <img
                  key={c.user_id}
                  src={c.user?.avatar_url || "/image.png"}
                  alt={c.user?.full_name}
                  title={c.user?.full_name}
                  className="w-6 h-6 border-2 border-white rounded-full dark:border-zinc-900 object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.src = "/image.png"; }}
                />
              ))}
            </div>
            {collaborators.length > 4 && (
              <span className="ml-1 text-xs text-slate-500 dark:text-zinc-500">
                +{collaborators.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
