import { useState, useMemo, useEffect } from "react";
import { MessageCircle, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/auth/useUser";
import { useSubjectsByProgram } from "../features/grades/useSubjects";
import { useAccessibleSubjectsWithUnread } from "../features/chat/useSubjects";
import Spinner from "../ui/components/Spinner";
import Pagination from "../ui/components/Pagination";
import Tabs from "../ui/components/Tabs";
import Input from "../ui/components/Input";
import Select from "../ui/components/Select";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../ui/components/Table";
import { IoMdSchool } from "react-icons/io";

const SEMESTERS = [
  { value: "S1", label: "Semestre 1" },
  { value: "S2", label: "Semestre 2" },
];

const TABS = [
  { key: "tous", label: "Tous" },
  { key: "cours", label: "Cours" },
  { key: "atelier", label: "Atelier" },
];

const ITEMS_PER_PAGE = 10;

const getDefaultSemester = () => {
  const month = new Date().getMonth() + 1;
  return month >= 9 || month <= 2 ? "S1" : "S2";
};

export default function EspaceMatiere() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [selectedSemester, setSelectedSemester] = useState(getDefaultSemester);
  const [activeTab, setActiveTab] = useState("tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { subjects, isLoading } = useSubjectsByProgram(user?.specialty_id, user?.level_id);
  const { data: subjectsWithUnread = [] } = useAccessibleSubjectsWithUnread();

  const filteredData = useMemo(() => {
    return subjects
      .filter((s) => s.semester === selectedSemester)
      .filter((s) => {
        if (activeTab === "cours") return s.mode === "cours";
        if (activeTab === "atelier") return s.mode === "atelier";
        return true;
      })
      .filter((s) => {
        if (!searchQuery) return true;
        return s.subjects?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map((s) => ({
        ...s,
        unread_count: subjectsWithUnread.find((su) => su.id === s.id)?.unread_count || 0,
      }));
  }, [subjects, selectedSemester, activeTab, searchQuery, subjectsWithUnread]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSemester, activeTab, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
          <IoMdSchool className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Espace Matières</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gérez vos cours et ateliers</p>
        </div>
      </div>

      <div className="flex flex-col bg-white border shadow-sm dark:bg-zinc-900 rounded-xl border-slate-200 dark:border-zinc-700">
        <div className="flex flex-col gap-4 p-4 border-b lg:flex-row lg:items-center lg:justify-between border-slate-100 dark:border-zinc-800">
          <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex gap-2">
            <Input
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-64"
              inputClassName="!py-2 !rounded-lg !border focus:!border-blue-500 focus:!ring-blue-500/20"
            />
            <Select
              icon={Filter}
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              options={SEMESTERS}
              className="!py-2 !rounded-lg focus:!border-blue-500 focus:!ring-blue-500/20 min-w-[140px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto h-[500px]">
          <Table>
            <TableHead>
              <TableRow className="border-b bg-slate-50 dark:bg-zinc-800/50 border-slate-100 dark:border-zinc-800">
                <TableHeader style={{ width: "400px" }}>Matière</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Coef / Crédit</TableHeader>
                <TableHeader>Semestre</TableHeader>
                <TableHeader className="text-right">Action</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="py-12 text-center text-slate-500">
                    Aucune matière trouvée
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((subject) => (
                  <TableRow
                    key={subject.id}
                    onClick={() => navigate(`/chat/${subject.id}`)}
                    className="border-b cursor-pointer border-slate-50 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                  >
                    <TableCell>
                      <span className="block font-medium text-slate-900 dark:text-white">
                        {subject.subjects?.name || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        subject.mode === "cours"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400"
                          : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400"
                      }`}>
                        {subject.mode === "cours" ? "Cours" : "Atelier"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300">{subject.coefficient || "-"}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-700 dark:text-slate-300">{subject.credit || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {subject.semester}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/chat/${subject.id}`); }}
                        className="relative p-2 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {subject.unread_count > 0 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}
