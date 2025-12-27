'use client';

import { Gamepad2, Users, Calendar, Trophy, ArrowRight, Filter, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

interface Tournament {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  difficulty: string;
  color: string;
  prizePool?: string;
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    // Check Role
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'ADMIN' || payload.role === 'EDITOR') setCanCreate(true);
        } catch (e) {
            console.error("Invalid token", e);
        }
    }

    const loadTournaments = async () => {
      try {
        const data = await fetcher('/tournaments');
        setTournaments(data);
      } catch (error) {
        console.error("Failed to fetch tournaments", error);
      } finally {
        setLoading(false);
      }
    };
    loadTournaments();
  }, []);

  const filteredTournaments = tournaments.filter(t => 
    filter === "All" || t.status === filter
  );

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-indigo-400 font-medium">Scanning mission protocols...</div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mission Select</h1>
          <p className="text-gray-400 mt-1">Join active operations and competitive protocols.</p>
        </div>
        <div>
          {canCreate && (
              <Link href="/tournaments/new" className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_-5px_rgba(255,255,255,0.5)]">
                Create Protocol
              </Link>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          {["All", "Active", "Upcoming", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                filter === f 
                  ? "bg-white text-black shadow-lg" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
           <input 
             type="text" 
             placeholder="Search missions..." 
             className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
           />
        </div>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((t) => (
            <div key={t.id} className="glass rounded-2xl flex flex-col group hover:border-indigo-500/30 transition-all hover:bg-white/[0.07] relative overflow-hidden">
              
              {/* Glow Effect on Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/20 group-hover:via-purple-500/20 group-hover:to-indigo-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>

              <div className="p-6 flex-1 relative z-10">
                <div className="flex justify-between items-start mb-4">
                   <div className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    t.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_-4px_rgba(52,211,153,0.5)]" :
                    t.status === "Upcoming" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  )}>
                    {t.status}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-white/5 border-white/10 text-gray-400"
                  )}>
                    {t.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {t.title}
                </h3>
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Trophy size={14} className="text-yellow-500" />
                      <span>Prize Pool</span>
                    </div>
                    <span className="font-mono font-medium text-yellow-400">{t.prizePool || "Honor & Glory"}</span>
                  </div>
                   <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={14} />
                      <span>Deadline</span>
                    </div>
                    <span className="font-mono font-medium text-white">{t.endDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-white/5 border-t border-white/10 relative z-10">
                <Link 
                  href={`/tournaments/${t.id}`}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-300 group-hover:text-white transition-colors group/btn"
                >
                  {t.status === "Active" ? "Access Terminal" : "Mission Briefing"}
                  <ArrowRight size={16} className="text-indigo-500 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center glass rounded-2xl border-dashed border-white/10">
             <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Gamepad2 className="text-gray-600" size={32} />
             </div>
             <p className="text-gray-500 font-medium">No missions found matching criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}