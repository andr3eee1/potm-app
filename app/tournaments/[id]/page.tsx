'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetcher } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Calendar, Trophy, Edit, Award, Upload, X, FileCode } from 'lucide-react';
import TypstRenderer from '@/app/components/TypstRenderer';

interface Tournament {
  id: string;
  title: string;
  description: string;
  statement?: string;
  status: string;
  startDate: string;
  endDate: string;
  difficulty: string;
  color: string;
  prizePool?: string;
  points: number;
  creatorId?: number;
}

export default function TournamentDetailPage() {
  const params = useParams();
  const { id } = params;
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Submission State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Check Admin/Editor Role
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCurrentUser(payload);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
      }
  };

  const submitSolution = async () => {
      if (!file) return;
      setSubmitting(true);
      setSubmitError('');
      try {
          const text = await file.text();
          await fetcher(`/tournaments/${id}/submit`, {
              method: 'POST',
              body: JSON.stringify({ code: text, language: 'cpp' })
          });
          setIsSubmitOpen(false);
          setFile(null);
          alert('Solution submitted successfully!');
      } catch (err: any) {
          setSubmitError(err.message);
      } finally {
          setSubmitting(false);
      }
  };

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

  const canViewSubmissions = currentUser && (currentUser.role === 'ADMIN' || (tournament.creatorId && currentUser.userId === tournament.creatorId));

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="mb-8">
          <Link href="/tournaments" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors mb-6">
              <ArrowLeft size={16} /> Back to Missions
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
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
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{tournament.title}</h1>
                  <p className="text-xl text-gray-400 max-w-3xl">{tournament.description}</p>
              </div>
              
              {canEdit && (
                  <Link 
                    href={`/tournaments/${tournament.id}/edit`}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                      <Edit size={16} /> Edit Protocol
                  </Link>
              )}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Statement */}
          <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="glass rounded-2xl p-1 border-t-4 border-t-indigo-500 min-h-[600px] flex flex-col">
                  <div className="p-6 md:p-8 border-b border-white/5 bg-white/5 rounded-t-xl">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                          <span className="text-indigo-500">#</span> Mission Statement
                      </h2>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1">
                      {tournament.statement ? (
                          <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-xl">
                              <TypstRenderer code={tournament.statement} />
                          </div>
                      ) : (
                          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl h-full flex items-center justify-center flex-col">
                              <p className="text-gray-500">No mission statement provided for this protocol.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* Sidebar - Stats & Actions */}
          <div className="lg:col-span-1 space-y-4 order-1 lg:order-2">
               {/* Prize Pool Card */}
               <div className="glass p-6 rounded-xl flex flex-col gap-2 border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center gap-3 text-yellow-400 mb-1 relative z-10">
                      <Trophy size={20} />
                      <span className="font-bold uppercase tracking-wider text-xs">Prize Pool</span>
                  </div>
                  <div className="text-3xl font-bold text-white font-mono relative z-10 tracking-tight">
                      {tournament.prizePool || "N/A"}
                  </div>
              </div>

               {/* Points Card */}
               <div className="glass p-5 rounded-xl flex items-center justify-between">
                  <div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Points</div>
                      <div className="text-white font-mono text-2xl font-bold">
                          {tournament.points} <span className="text-sm text-gray-500 font-sans">PTS</span>
                      </div>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                      <Award size={24} />
                  </div>
              </div>

              {/* Timeline Card */}
              <div className="glass p-5 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-4 text-xs font-bold uppercase tracking-wider">
                      <Calendar size={14} /> Mission Timeline
                  </div>
                  <div className="space-y-4 relative">
                      {/* Connector Line */}
                      <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-white/10 rounded-full"></div>

                      <div className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#050505]"></div>
                          <p className="text-xs text-indigo-400 font-bold uppercase mb-0.5">Start</p>
                          <p className="text-white font-mono text-sm">{new Date(tournament.startDate).toLocaleDateString()}</p>
                          <p className="text-[10px] text-gray-500">{new Date(tournament.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="relative pl-6">
                           <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gray-700 border-2 border-[#050505]"></div>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Deadline</p>
                          <p className="text-white font-mono text-sm">{new Date(tournament.endDate).toLocaleDateString()}</p>
                          <p className="text-[10px] text-gray-500">{new Date(tournament.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                  </div>
              </div>

              {/* Submit Button */}
              {tournament.status === 'Active' && (
                <button 
                    onClick={() => setIsSubmitOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                    <span className="uppercase tracking-wider">Submit Solution</span>
                    <Upload size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                </button>
              )}

              {/* Creator Actions */}
              {canViewSubmissions && (
                  <Link href={`/tournaments/${tournament.id}/submissions`} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors">
                      <FileCode size={16} /> View Submissions
                  </Link>
              )}
          </div>
      </div>

      {/* Submit Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
                <button onClick={() => setIsSubmitOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X size={20} />
                </button>
                <h3 className="text-2xl font-bold text-white mb-2">Upload Solution</h3>
                <p className="text-gray-400 text-sm mb-6">Submit your source code (.c, .cpp). Only the last submission is counted.</p>
                
                {submitError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{submitError}</div>
                )}

                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors bg-white/5 cursor-pointer relative group">
                    <input 
                        type="file" 
                        accept=".c,.cpp" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="group-hover:scale-110 transition-transform duration-300">
                         <Upload className="mx-auto text-indigo-500 mb-2" size={32} />
                    </div>
                    <p className="text-white font-medium">{file ? file.name : "Click to browse or drag file"}</p>
                    <p className="text-xs text-gray-500 mt-1">Supported: C, C++</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsSubmitOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white font-medium">Cancel</button>
                    <button 
                        onClick={submitSolution}
                        disabled={!file || submitting}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {submitting ? 'Uploading...' : 'Submit Protocol'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
