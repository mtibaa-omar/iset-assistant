import { useState } from "react";
import Modal from "../../ui/components/Modal";
import Button from "../../ui/components/Button";

export default function PomodoroSettings({ isOpen, onClose, session, onSave, isSaving }) {
  const [workDuration, setWorkDuration] = useState(session?.work_duration || 25);
  const [shortBreak, setShortBreak] = useState(session?.short_break || 5);
  const [longBreak, setLongBreak] = useState(session?.long_break || 15);

  const handleSave = () => {
    onSave({
      work_duration: workDuration,
      short_break: shortBreak,
      long_break: longBreak,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Paramètres du timer">
      <div className="p-6 space-y-5">
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-400">
            Durée de travail (min)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={25}
              max={60}
              step={5}
              value={workDuration}
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-zinc-700 accent-purple-600"
            />
            <span className="w-12 text-center text-lg font-bold text-purple-600 dark:text-purple-400">
              {workDuration}
            </span>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-400">
            Pause courte (min)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={shortBreak}
              onChange={(e) => setShortBreak(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-zinc-700 accent-purple-600"
            />
            <span className="w-12 text-center text-lg font-bold text-purple-600 dark:text-purple-400">
              {shortBreak}
            </span>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-400">
            Pause longue (min)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={longBreak}
              onChange={(e) => setLongBreak(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-zinc-700 accent-purple-600"
            />
            <span className="w-12 text-center text-lg font-bold text-purple-600 dark:text-purple-400">
              {longBreak}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Enregistrement..."
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
