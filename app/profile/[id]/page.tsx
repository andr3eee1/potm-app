'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/api';
import { useParams } from 'next/navigation';
import { User, Trophy, Calendar, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  totalPoints: number;
  joinedAt: string;
  rank: number;
  participations: {
    tournamentId: number;
    tournamentTitle: string;
    status: string;
    joinedAt: string;
    score: number;
  }[];
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetcher(`/users/${id}`);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadProfile();
  }, [id]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-indigo-400 font-medium">Accessing Personnel Record...</div>
        </div>
    );
  }

  if (!profile) {
      return <div className="text-center p-12 text-gray-500">Operative not found.</div>;
  }

  const initials = (profile.name || profile.email)[0].toUpperCase();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-white/5 flex items-center justify-center shadow-2xl">
                  <span className="text-5xl font-bold text-white">{initials}</span>
              </div>
              <div className="text-center md:text-left flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                      <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/5">
                          {profile.role}
                      </span>
                      <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-gray-400 uppercase tracking-wider border border-white/5 flex items-center gap-2">
                          <Clock size={12} /> Joined {new Date(profile.joinedAt).toLocaleDateString()}
                      </span>
                  </div>
                  
                  <div className="flex justify-center md:justify-start gap-8">
                      <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Global Rank</p>
                          <p className="text-3xl font-bold text-white flex items-center gap-2">
                              <span className="text-yellow-400">#</span>{profile.rank}
                          </p>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Score</p>
                          <p className="text-3xl font-bold text-indigo-400 font-mono shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]">
                              {profile.totalPoints}
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* History */}
      <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="text-emerald-400" /> Mission History
          </h2>
          
          <div className="grid gap-4">
              {profile.participations.length > 0 ? (
                  profile.participations.map((p) => (
                      <div key={p.tournamentId} className="glass rounded-xl p-6 flex items-center justify-between group hover:border-white/20 transition-colors">
                          <div className="flex items-center gap-4">
                              <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center",
                                  p.status === 'ACTIVE' ? "bg-emerald-500/20 text-emerald-400" : 
                                  p.status === 'COMPLETED' ? "bg-gray-800 text-gray-400" : "bg-blue-500/20 text-blue-400"
                              )}>
                                  <Trophy size={20} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{p.tournamentTitle}</h3>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">{p.status}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Score</p>
                              <p className="text-xl font-bold text-white font-mono">{p.score}</p>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="glass rounded-xl p-8 text-center text-gray-500 border-dashed border-white/10">
                      No mission records found.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
