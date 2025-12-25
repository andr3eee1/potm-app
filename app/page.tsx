'use client';

import { Trophy, Gamepad2, Users, Calendar, ArrowRight, Activity, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

interface DashboardStats {
  activeTournaments: number;
  totalParticipants: number;
  nextContest: string | null;
  featuredTournament: {
    title: string;
    description: string;
    status: string;
    participants: number;
    tasks: number;
    prizePool: string;
    endDate: string;
  } | null;
  leaderboard: {
    id: number;
    name: string;
    score: number;
    rank: number;
    avatar: string;
  }[];
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    const loadStats = async () => {
        try {
            const data = await fetcher('/home/stats');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    loadStats();
  }, []);

  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-indigo-400 font-medium">Loading command center...</div>
        </div>
      );
  }

  const statItems = [
    { label: "Active Operations", value: stats?.activeTournaments.toString() || "0", icon: Activity, color: "text-emerald-400" },
    { label: "Global Agents", value: stats?.totalParticipants.toString() || "0", icon: Users, color: "text-blue-400" },
    { label: "Next Deployment", value: stats?.nextContest ? new Date(stats.nextContest).toLocaleDateString() : "TBA", icon: Clock, color: "text-purple-400" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-gray-400 mt-1">Monitor operational status and active missions.</p>
        </div>
        {!user && (
           <div className="flex gap-3">
             <Link href="/login" className="px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors">
               Log In
             </Link>
             <Link href="/register" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_-5px_rgba(255,255,255,0.5)]">
               Initialize Access
             </Link>
           </div>
        )}
      </div>

      {/* Stats Bento Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-6 relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", stat.color)}>
                <stat.icon size={80} />
            </div>
            <div className="relative z-10">
                <div className={cn("mb-2", stat.color)}>
                    <stat.icon size={24} />
                </div>
               <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
               <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Mission - Main Card */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap size={18} className="text-yellow-400"/> Priority Mission
                </h2>
                <Link href="/tournaments" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    All Missions <ArrowRight size={14} />
                </Link>
            </div>

            {stats?.featuredTournament ? (
                <div className="glass rounded-2xl p-1 group hover:border-indigo-500/30 transition-colors">
                    <div className="bg-black/40 rounded-xl p-6 sm:p-8 relative overflow-hidden">
                        {/* Abstract Background Element */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"></div>

                        <div className="relative z-10">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_-4px_rgba(52,211,153,0.5)]">
                                        {stats.featuredTournament.status}
                                        </span>
                                        <span className="text-xs font-mono text-gray-400">
                                            // T-MINUS: {new Date(stats.featuredTournament.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                        {stats.featuredTournament.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
                                        {stats.featuredTournament.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Bounty</p>
                                    <p className="text-2xl font-mono font-bold text-yellow-400 shadow-[0_0_15px_-5px_rgba(250,204,21,0.3)]">{stats.featuredTournament.prizePool}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Modules</p>
                                    <p className="text-lg font-bold text-white">{stats.featuredTournament.tasks}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Agents</p>
                                    <p className="text-lg font-bold text-white">{stats.featuredTournament.participants}</p>
                                </div>
                                <div className="col-span-2 sm:col-span-2">
                                     <button className="w-full h-full bg-white text-black hover:bg-gray-200 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <Gamepad2 size={18} />
                                        Engage Protocol
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass rounded-2xl p-8 text-center border-dashed border-white/10">
                    <p className="text-gray-500">No active missions detected.</p>
                </div>
            )}
        </div>

        {/* Leaderboard - Side Panel */}
        <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy size={18} className="text-indigo-400"/> Top Operatives
            </h2>
            
            <div className="glass rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5">
                    <div className="grid grid-cols-12 text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-7">Operative</div>
                        <div className="col-span-3 text-right">Score</div>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {stats?.leaderboard && stats.leaderboard.length > 0 ? (
                        stats.leaderboard.map((p) => (
                            <div key={p.name} className="grid grid-cols-12 items-center p-4 hover:bg-white/5 transition-colors group">
                                <Link href={`/profile/${p.id}`} className="flex items-center gap-4 group-hover:opacity-80 transition-opacity">
                                    <div className="col-span-2 text-center">
                                        <span className={cn(
                                            "font-mono font-bold text-sm",
                                            p.rank === 1 ? "text-yellow-400" : p.rank === 2 ? "text-gray-300" : p.rank === 3 ? "text-amber-700" : "text-gray-600"
                                        )}>#{p.rank}</span>
                                    </div>
                                    <div className="col-span-7 flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:text-white group-hover:border-indigo-500/50 transition-colors">
                                            {p.avatar}
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate">{p.name}</span>
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <span className="font-mono font-bold text-indigo-400 text-sm">{p.score}</span>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                         <div className="p-8 text-center text-gray-600 text-sm">No data available.</div>
                    )}
                </div>
                <div className="p-3 bg-white/5 text-center">
                    <Link href="/leaderboard" className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                        View Global Rankings
                    </Link>
                </div>
            </div>
            
            {user && (
                <div className="glass rounded-2xl p-6 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[40px] group-hover:bg-indigo-600/20 transition-colors"></div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Your Standing</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">Unranked</span>
                        <span className="text-sm text-gray-500 font-mono">/ {stats?.totalParticipants}</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}