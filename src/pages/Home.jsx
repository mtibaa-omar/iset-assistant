import { useMemo } from "react";
import { Star, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../features/auth/useUser";
import { useSubjectsByProgram, useStudentGrades, useCurrentAcademicYear } from "../features/grades/useSubjects";
import { useNews } from "../features/news/useNews";
import { useConversations } from "../features/dm/useDM";
import { calculateTotals, getCurrentSemester } from "../utils/gradeCalculations";
import StatCard from "../ui/components/StatCard";
import NewsCard from "../features/news/NewsCard";
import Spinner from "../ui/components/Spinner";
import { formatSmartTime } from "../utils/dateUtils";
import { FiFileText } from "react-icons/fi";

export default function Home() {
  const { user } = useUser();
  const { subjects } = useSubjectsByProgram(user?.specialty_id, user?.level_id);
  const { academicYear } = useCurrentAcademicYear();
  const { news, isLoading: newsLoading } = useNews();
  const { conversations, isLoading: conversationsLoading } = useConversations();
  const programSubjectIds = useMemo(() => subjects.map((s) => s.id), [subjects]);
  const { grades } = useStudentGrades(user?.id, programSubjectIds, academicYear?.id);

  const currentSemester = getCurrentSemester();

  const stats = useMemo(() => {
    const currentSubjects = subjects.filter((s) => s.semester === currentSemester);
    
    const gradesMap = {};
    grades.forEach((g) => {
      gradesMap[g.program_subject_id] = {
        note_dc: g.note_dc,
        note_exam: g.note_exam,
        note_tp1: g.note_tp1,
        note_tp2: g.note_tp2,
      };
    });

    const totals = calculateTotals(currentSubjects, gradesMap);

    return {
      moyenne: totals.generalAverage || "0.00",
      totalCredit: totals.totalCredit,
      creditAcquis: totals.creditAcquis,
      activeSubjects: totals.activeSubjects,
    };
  }, [subjects, grades, currentSemester]);

  const unreadMessages = useMemo(() => {
    if (!conversations || conversations.length === 0) return [];
    return conversations
      .filter((c) => c.unread_count > 0)
      .slice(0, 3)
      .map((conv) => {
        const otherUser = conv.user1?.id === user?.id ? conv.user2 : conv.user1;
        const username = otherUser?.full_name?.toLowerCase().replace(/\s+/g, "_") || "user";
        return {
          ...conv,
          username,
          avatar_url: otherUser?.avatar_url,
          full_name: otherUser?.full_name,
        };
      });
  }, [conversations, user?.id]);

  const recentNews = useMemo(() => {
    if (!news || news.length === 0) return [];
    return news.slice(0, 2);
  }, [news]);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const userName = user?.user_metadata?.full_name || "User";
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-full md:pl-4 lg:pl-8 pt-0 pb-4 space-y-6 md:px-6 md:pb-6 md:space-y-8">
      <div className="mb-6 md:mb-8">
        <h1 className="mb-1 text-2xl font-bold md:text-3xl lg:text-4xl text-slate-900 dark:text-white md:mb-2">
          {getGreeting()}, {firstName}! 👋
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
          Voici ce qui se passe aujourd'hui.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        <StatCard
          title="Moyenne Générale"
          value={stats.moyenne}
          icon={Star}
          variant="purple"
        />
        
        <StatCard
          title="Crédits Acquis"
          value={stats.creditAcquis}
          subtitle={`/ ${stats.totalCredit}`}
          icon={GraduationCap}
          variant="blue"
          progress={{
            label: "Progression",
            percentage: stats.totalCredit > 0 ? Math.round((stats.creditAcquis / stats.totalCredit) * 100) : 0
          }}
        />
        
        <StatCard
          title="Matières Actives"
          value={stats.activeSubjects}
          subtitle={currentSemester === "S1" ? "Semestre 1" : "Semestre 2"}
          icon={FiFileText}
          variant="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {newsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : recentNews.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-1.5 h-8 md:h-10 bg-purple-600 rounded-full" />
                  <h2 className="text-xl font-bold md:text-2xl 2xl:text-4xl text-slate-900 dark:text-white">
                    Dernières Actualités
                  </h2>
                </div>
                <Link
                  to="/actualites"
                  className="text-sm font-semibold text-purple-600 transition-colors md:text-lg dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  Voir tout
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6 2xl:gap-8">
                {recentNews.map((item) => (
                  <NewsCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-1">
          {unreadMessages.length > 0 && (
            <div className="h-full p-6 md:p-8 2xl:p-10 transition-all border shadow-sm bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-slate-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <h2 className="text-sm md:text-md 2xl:text-2xl font-bold text-slate-900 dark:text-white">
                  Messages non lus
                </h2>
                <span className="px-3 py-1 text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400 rounded-full">
                  {unreadMessages.length} nouveau{unreadMessages.length > 1 ? "x" : ""}
                </span>
              </div>
              
              <div className="space-y-6">
                {unreadMessages.map((convo) => (
                  <Link
                    key={convo.id}
                    to={`/messages/${convo.username}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={convo.avatar_url || "/image.png"}
                        alt={convo.full_name}
                        className="object-cover w-12 h-12 rounded-full ring-2 ring-white dark:ring-zinc-800 shadow-sm"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-800 rounded-full" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-bold truncate text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                          {convo.full_name}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                          {formatSmartTime(convo.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs truncate text-slate-500 dark:text-zinc-400">
                        {convo.last_message || "Nouveau message"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 border-t border-slate-200 dark:border-zinc-800">
                <Link
                  to="/messages"
                  className="flex items-center justify-center w-full py-4 text-sm md:text-base font-semibold transition-colors text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Voir tous les messages
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
