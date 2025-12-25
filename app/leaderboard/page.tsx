'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/api';
import { Trophy, Medal, Award } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LeaderboardUser {
  id: number;
  name: string;
  score: number;
  rank: number;
  role: string;
  avatar: string;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetcher('/home/leaderboard');
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-indigo-400 font-medium">Calibrating Rankings...</div>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="border-b border-white/10 pb-6 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
            <Trophy className="text-yellow-400" size={32} />
            Hall of Fame
        </h1>
        <p className="text-gray-400 mt-2">Elite operatives ranked by global contribution.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-xs tracking-wider w-24 text-center">Rank</th>
                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-xs tracking-wider">Operative</th>
                <th className="px-6 py-5 text-gray-400 font-bold uppercase text-xs tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                        {user.rank === 1 ? (
                            <Trophy size={24} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        ) : user.rank === 2 ? (
                            <Medal size={24} className="text-gray-300" />
                        ) : user.rank === 3 ? (
                            <Award size={24} className="text-amber-700" />
                        ) : (
                            <span className="font-mono font-bold text-gray-500 text-lg">#{user.rank}</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/profile/${user.id}`} className="flex items-center gap-4 group-hover:opacity-80 transition-opacity">
                      <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg",
                          user.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black border border-yellow-200" :
                          "bg-gradient-to-br from-gray-800 to-black border border-white/10 text-white"
                      )}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">{user.name}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{user.role}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-xl font-bold text-indigo-400 shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]">
                        {user.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
