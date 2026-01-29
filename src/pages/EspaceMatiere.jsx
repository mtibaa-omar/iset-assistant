import { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { MessageCircle, FilterX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/auth/useUser";
import { useSubjectsByProgram } from "../features/grades/useSubjects";
import Select from "../ui/components/Select";
import Button from "../ui/components/Button";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

ModuleRegistry.registerModules([AllCommunityModule]);
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useDarkMode } from "../context/DarkModeContext";
import Spinner from "../ui/components/Spinner";

const SEMESTERS = [
  { value: "S1", label: "Semestre 1" },
  { value: "S2", label: "Semestre 2" },
];

const getDefaultSemester = () => {
  const month = new Date().getMonth() + 1;
  return month >= 9 || month <= 2 ? "S1" : "S2";
};

const ChatCellRenderer = (params) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-full">
      <button
        onClick={() => navigate(`/chat/${params.data.id}`)}
        className="p-1.5 rounded-lg transition-colors"
        title="Ouvrir la discussion"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default function EspaceMatiere() {
  const gridRef = useRef(null);
  const { user } = useUser();
  const { isDarkMode } = useDarkMode();
  const [selectedSemester, setSelectedSemester] = useState(getDefaultSemester);

  const onClearFilters = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setFilterModel(null);
      gridRef.current.api.applyColumnState({
        defaultState: { sort: null },
      });
    }
  };
  
  const specialtyId = user?.specialty_id;
  const levelId = user?.level_id;

  const { subjects, isLoading } = useSubjectsByProgram(specialtyId, levelId);

  const filteredData = useMemo(() => {
    return subjects
      .filter((s) => s.semester === selectedSemester)
      .map((s) => ({
        id: s.id,
        name: s.subjects?.name || "N/A",
        mode: s.mode === "cours" ? "Cours" : "Atelier",
      }));
  }, [subjects, selectedSemester]);

  const columnDefs = useMemo(() => [
    { 
      field: "name", 
      headerName: "Matière", 
      flex: 2,
      minWidth: 150,
      filter: true,
      sortable: true
    },
    { 
      field: "mode", 
      headerName: "Type", 
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true
    },
    { 
      headerName: "Chat", 
      field: "id",
      flex: 0.5,
      cellRenderer: ChatCellRenderer,
      sortable: false,
      filter: false,
      pinned: "right",
      maxWidth: 80
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
  }), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 md:px-6 md:pb-6 pt-0 space-y-6 flex flex-col h-full overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Espace Matières
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Consultez vos matières et gérez vos discussions
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Semestre:
            </span>
            <Select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              options={SEMESTERS}
              className="w-40"
            />
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

          <Button
            variant="secondary"
            icon={FilterX}
            onClick={onClearFilters}
            className="flex items-center"
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[525px]">
        <div className={`${isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"} w-full h-full`}>
          <AgGridReact
            ref={gridRef}
            theme="legacy"
            rowData={filteredData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
            noRowsOverlayComponent={() => (
              <span className="text-slate-500">Aucune matière trouvée pour ce semestre</span>
            )}
          />
        </div>
      </div>
    </div>
  );
}
