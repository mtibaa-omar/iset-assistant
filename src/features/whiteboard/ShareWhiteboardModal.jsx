import { useState } from "react";
import { Search, X, UserPlus, Globe, Lock, Link2, Check } from "lucide-react";
import Modal from "../../ui/components/Modal";
import Button from "../../ui/components/Button";
import Spinner from "../../ui/components/Spinner";
import { useSearchUsers, useAddCollaborator, useRemoveCollaborator } from "./useWhiteboards";
import { useUpdateWhiteboard } from "./useWhiteboards";

export default function ShareWhiteboardModal({ isOpen, onClose, board }) {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const { data: searchResults = [], isLoading: searching } = useSearchUsers(search);
  const addCollab = useAddCollaborator();
  const removeCollab = useRemoveCollaborator();
  const updateBoard = useUpdateWhiteboard();

  if (!board) return null;

  const collaborators = board.whiteboard_collaborators || [];
  const collaboratorIds = collaborators.map((c) => c.user_id);

  const filteredResults = searchResults.filter(
    (u) => u.id !== board.owner_id && !collaboratorIds.includes(u.id)
  );

  const boardLink = `${window.location.origin}/tableaux/${board.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(boardLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = boardLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAdd = (userId) => {
    addCollab.mutate({ whiteboardId: board.id, userId, role: "editor" });
    setSearch("");
  };

  const handleRemove = (userId) => {
    removeCollab.mutate({ whiteboardId: board.id, userId });
  };

  const togglePublic = () => {
    updateBoard.mutate({ id: board.id, is_public: !board.is_public });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Partager le tableau">
      <div className="p-6 space-y-6">
        {/* Public toggle */}
        <div className="flex items-center justify-between p-3 border rounded-xl border-slate-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            {board.is_public ? (
              <Globe className="w-5 h-5 text-green-500" />
            ) : (
              <Lock className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-zinc-100">
                {board.is_public ? "Public" : "Privé"}
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-500">
                {board.is_public
                  ? "Tous les utilisateurs connectés peuvent voir"
                  : "Seuls le propriétaire et les collaborateurs"}
              </p>
            </div>
          </div>
          <button
            onClick={togglePublic}
            disabled={updateBoard.isPending}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              board.is_public ? "bg-green-500" : "bg-slate-300 dark:bg-zinc-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                board.is_public ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Copy link - only show when there are collaborators */}
        {collaborators.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1 gap-2 px-3 py-2.5 overflow-hidden border-2 rounded-xl border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800">
              <Link2 className="w-4 h-4 shrink-0 text-slate-400 dark:text-zinc-500" />
              <span className="text-sm truncate select-all text-slate-600 dark:text-zinc-400">
                {boardLink}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Copier
                </>
              )}
            </button>
          </div>
        )}

        {/* Search users */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-400">
            Ajouter un collaborateur
          </label>
          <div className="relative">
            <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom..."
              className="w-full py-2.5 pl-9 pr-9 text-sm border-2 rounded-xl border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-purple-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute -translate-y-1/2 right-3 top-1/2"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Search results */}
          {search.length >= 2 && (
            <div className="mt-2 overflow-hidden overflow-y-auto border rounded-xl border-slate-200 dark:border-zinc-700 max-h-48">
              {searching ? (
                <Spinner size="h-6 w-6" className="my-3" />
              ) : filteredResults.length === 0 ? (
                <p className="p-3 text-sm text-center text-slate-500 dark:text-zinc-500">
                  Aucun utilisateur trouvé
                </p>
              ) : (
                filteredResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || "/image.png"}
                        alt={user.full_name}
                        className="object-cover w-8 h-8 rounded-full"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.target.src = "/image.png"; }}
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-zinc-100">
                        {user.full_name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAdd(user.id)}
                      disabled={addCollab.isPending}
                      className="p-1.5 text-purple-600 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Current collaborators */}
        {collaborators.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-400">
              Collaborateurs ({collaborators.length})
            </h4>
            <div className="space-y-2">
              {collaborators.map((c) => (
                <div
                  key={c.user_id}
                  className="flex items-center justify-between p-3 border rounded-xl border-slate-200 dark:border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.user?.avatar_url || "/image.png"}
                      alt={c.user?.full_name}
                      className="object-cover w-8 h-8 rounded-full"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.src = "/image.png"; }}
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900 dark:text-zinc-100">
                        {c.user?.full_name}
                      </span>
                      <span className="ml-2 text-xs capitalize text-slate-500 dark:text-zinc-500">
                        {c.role === "editor" ? "Éditeur" : "Lecteur"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(c.user_id)}
                    disabled={removeCollab.isPending}
                    className="p-1.5 text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
