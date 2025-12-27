'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Trophy, Edit } from 'lucide-react';
import TypstRenderer from '@/app/components/TypstRenderer';

interface Tournament {
  id: string;
  title: string;
  description: string;
  statement?: string;
  status: string;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  tasksCount: number;
  difficulty: string;
  color: string;
}

export default function TournamentDetailPage() {
  const params = useParams();
  const { id } = params;
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check Admin/Editor Role
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'ADMIN' || payload.role === 'EDITOR') setCanEdit(true);
        } catch (e) {
            console.error("Invalid token", e);
        }
    }

    if (!id) return;

    const loadTournament = async () => {
      try {
        const data = await fetcher(`/tournaments/${id}`);
        setTournament(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [id]);

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-indigo-400 font-medium">Decrypting mission files...</div>
        </div>
    );
  }

  if (error || !tournament) {
      return (
          <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-red-500">Mission Not Found</h2>
              <p className="text-gray-400 mt-2">{error || "Invalid protocol ID"}</p>
              <Link href="/tournaments" className="mt-6 inline-block text-indigo-400 hover:text-indigo-300">Return to Mission Select</Link>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
          <Link href="/tournaments" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors mb-6">
              <ArrowLeft size={16} /> Back to Missions
          </Link>
          
          <div className="flex justify-between items-start">
              <div>
                  <div className="flex items-center gap-3 mb-2">
                       <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            tournament.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            tournament.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                       }`}>
                           {tournament.status}
                       </span>
                       <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-white/5 border-white/10 text-gray-400">
                           {tournament.difficulty}
                       </span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2">{tournament.title}</h1>
                  <p className="text-xl text-gray-400">{tournament.description}</p>
              </div>
              
              {canEdit && (
                  <Link 
                    href={`/tournaments/${tournament.id}/edit`}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
                  >
                      <Edit size={16} /> Edit Protocol
                  </Link>
              )}
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                  <Calendar size={24} />
              </div>
              <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Timeline</div>
                  <div className="text-white font-mono text-sm">
                      {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  </div>
              </div>
          </div>
          
           <div className="glass p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                  <Users size={24} />
              </div>
              <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Operatives</div>
                  <div className="text-white font-mono text-sm">
                      {tournament.participants} / {tournament.maxParticipants}
                  </div>
              </div>
          </div>

           <div className="glass p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                  <Trophy size={24} />
              </div>
              <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Modules</div>
                  <div className="text-white font-mono text-sm">
                      {tournament.tasksCount} Tasks
                  </div>
              </div>
          </div>
      </div>

      {/* Statement Section */}
      <div className="glass rounded-2xl p-8 border-t-4 border-t-indigo-500">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-indigo-500">#</span> Mission Statement
          </h2>
          
          {tournament.statement ? (
              <div className="overflow-hidden rounded-xl border border-white/10">
                  <TypstRenderer code={tournament.statement} />
              </div>
          ) : (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-500">No mission statement provided for this protocol.</p>
              </div>
          )}
      </div>
    </div>
  );
}
