import { forwardRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { useDarkMode } from "../../../context/DarkModeContext";


const AdminTable = forwardRef(({
  rowData,
  columnDefs,
  onSelectionChanged,
  context,
  height = "650px",
  pagination = true,
  paginationPageSize = 20,
  paginationPageSizeSelector = [10, 20, 50],
  rowSelection,
  noRowsMessage = "Aucune donnée disponible",
  ...props
}, ref) => {
  const { isDarkMode } = useDarkMode();

  const defaultColDef = useMemo(() => ({
    resizable: true,
  }), []);

  const defaultRowSelection = useMemo(() => ({
    mode: "multiRow",
  }), []);

  const localeText = useMemo(() => ({
    noRowsToShow: noRowsMessage,
    page: "Page",
    of: "sur",
    to: "à",
    nextPage: "Page suivante",
    previousPage: "Page précédente",
    firstPage: "Première page",
    lastPage: "Dernière page",
    pageSizeSelectorLabel: "Éléments par page:",
  }), [noRowsMessage]);

  return (
    <div 
      className={`${isDarkMode ? "ag-theme-quartz-dark" : "ag-theme-quartz"} rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800`}
      style={{ height }}
    >
      <AgGridReact
        theme="legacy"
        ref={ref}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection={rowSelection ?? defaultRowSelection}
        onSelectionChanged={onSelectionChanged}
        context={context}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        localeText={localeText}
        {...props}
      />
    </div>
  );
});

AdminTable.displayName = "AdminTable";

export default AdminTable;
