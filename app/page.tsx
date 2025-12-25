'use client';

import { Trophy, Gamepad2, Users, Calendar, ArrowRight } from "lucide-react";
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
      return <div className="p-8 text-center text-white">Loading dashboard...</div>;
  }

  const statItems = [
    { label: "Active Tournaments", value: stats?.activeTournaments.toString() || "0", icon: Gamepad2, color: "text-blue-500" },
    { label: "Total Participants", value: stats?.totalParticipants.toString() || "0", icon: Users, color: "text-green-500" },
    { label: "Next Contest", value: stats?.nextContest ? new Date(stats.nextContest).toLocaleDateString() : "TBA", icon: Calendar, color: "text-purple-500" },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Programmer of the Month
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              Compete in mini-games, solve complex tasks, and earn the prestigious title of Programmer of the Month.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20">
                Join Tournament
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-slate-700">
                View Rules
              </button>
            </div>
          </div>
          
          {user ? (
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 w-full md:w-80">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-yellow-500" size={24} />
                <h2 className="font-bold text-xl text-slate-100">Your Stats</h2>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-lg">{user.name || 'User'}</p>
                  <p className="text-slate-400 text-sm">Role: {user.role}</p>
                </div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Total Points</p>
                {/* Note: Ideally fetch specific user stats from an endpoint too */}
                <p className="text-2xl font-mono font-bold text-emerald-400">0</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 w-full md:w-80">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-slate-500" size={24} />
                <h2 className="font-bold text-xl text-slate-100">Get Started</h2>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Login or Register to start competing and earn points.
              </p>
              <Link href="/login" className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors">
                Login Now
              </Link>
            </div>
          )}
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-hover hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl bg-slate-100 dark:bg-slate-800", stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Live</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Tournament Card */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Tournaments</h2>
            <Link href="/tournaments" className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          {stats?.featuredTournament ? (
          <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {stats.featuredTournament.status}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">{stats.featuredTournament.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                    {stats.featuredTournament.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Prize Pool</p>
                  <p className="text-xl font-bold text-emerald-500">{stats.featuredTournament.prizePool}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">Tasks</span>
                  <span className="font-bold text-slate-900 dark:text-white">{stats.featuredTournament.tasks}</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">Participants</span>
                  <span className="font-bold text-slate-900 dark:text-white">{stats.featuredTournament.participants}</span>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">Ends in</span>
                  <span className="font-bold text-slate-900 dark:text-white text-orange-500">
                    {new Date(stats.featuredTournament.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                  Go to Arena
                </button>
                <button className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p>No active tournaments found.</p>
            </div>
          )}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Leaderboard</h2>
            <Link href="/leaderboard" className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline">
              Full list <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Rankings</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats?.leaderboard && stats.leaderboard.length > 0 ? (
                stats.leaderboard.map((p) => (
                    <div key={p.name} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                        "w-6 text-sm font-bold",
                        p.rank === 1 ? "text-yellow-500" : p.rank === 2 ? "text-slate-400" : "text-amber-700"
                        )}>
                        #{p.rank}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {p.avatar}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{p.name}</span>
                    </div>
                    <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{p.score}</span>
                        <span className="text-[10px] block text-slate-400 uppercase font-bold tracking-tighter">pts</span>
                    </div>
                    </div>
                ))
              ) : (
                <div className="p-8 text-center">
                    <p className="text-slate-500 text-sm">No rankings available yet.</p>
                </div>
              )}
            </div>
            <button className="w-full p-4 text-center text-slate-500 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}