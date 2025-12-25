import { Gamepad2, Users, Calendar, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tournaments = [
  {
    id: "1",
    title: "December Code Sprint",
    status: "Active",
    participants: 45,
    maxParticipants: 100,
    startDate: "Dec 20, 2025",
    endDate: "Dec 30, 2025",
    tasksCount: 5,
    difficulty: "Medium",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "SQL Mastery Challenge",
    status: "Upcoming",
    participants: 0,
    maxParticipants: 50,
    startDate: "Jan 5, 2026",
    endDate: "Jan 10, 2026",
    tasksCount: 3,
    difficulty: "Hard",
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "Frontend Pixel Perfect",
    status: "Active",
    participants: 82,
    maxParticipants: 150,
    startDate: "Dec 22, 2025",
    endDate: "Dec 28, 2025",
    tasksCount: 4,
    difficulty: "Easy",
    color: "bg-emerald-500",
  },
  {
    id: "4",
    title: "Python Automation Blitz",
    status: "Completed",
    participants: 120,
    maxParticipants: 120,
    startDate: "Nov 15, 2025",
    endDate: "Nov 20, 2025",
    tasksCount: 6,
    difficulty: "Medium",
    color: "bg-slate-500",
  },
];

export default function TournamentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tournaments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Browse and join active coding competitions.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20">
            Create Tournament
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Active", "Upcoming", "Completed"].map((filter) => (
          <button
            key={filter}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border whitespace-nowrap transition-colors",
              filter === "All" 
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent" 
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-hover hover:shadow-md group">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl text-white shadow-lg", t.color)}>
                  <Gamepad2 size={24} />
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  t.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  t.status === "Upcoming" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                  "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}>
                  {t.status}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t.title}
              </h3>
              
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <Users size={16} />
                  <span>{t.participants}/{t.maxParticipants} joined</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <Trophy size={16} />
                  <span>{t.tasksCount} mini-games</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <Calendar size={16} />
                  <span>{t.startDate}</span>
                </div>
              </div>

              {/* Difficulty badge */}
              <div className="mt-4">
                <span className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                  t.difficulty === "Hard" ? "border-red-200 text-red-600 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400" :
                  t.difficulty === "Medium" ? "border-orange-200 text-orange-600 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-900/20 dark:text-orange-400" :
                  "border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400"
                )}>
                  {t.difficulty}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ends on {t.endDate}</span>
              <Link 
                href={`/tournaments/${t.id}`}
                className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-1 group/btn"
              >
                {t.status === "Active" ? "Join Now" : "Details"}
                <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
