'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import { ArrowLeft, Check, X, FileText, Code, Clock } from 'lucide-react';
import Link from 'next/link';

interface Submission {
  id: number;
  userId: number;
  code: string;
  language: string;
  status: string;
  score: number | null;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
}

export default function SubmissionsPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Grading state
  const [gradingId, setGradingId] = useState<number | null>(null);
  const [gradeScore, setGradeScore] = useState<string>('');

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await fetcher(`/tournaments/${id}/submissions`);
        setSubmissions(data);
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes('Access denied') || err.message.includes('403')) {
            router.push(`/tournaments/${id}`);
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) loadSubmissions();
  }, [id, router]);

  const handleGrade = async (submissionId: number, status: 'ACCEPTED' | 'REJECTED') => {
      const scoreVal = parseInt(gradeScore);
      if (status === 'ACCEPTED' && (isNaN(scoreVal) || scoreVal < 0)) {
          alert("Please enter a valid score.");
          return;
      }

      try {
          setGradingId(submissionId);
          await fetcher(`/tournaments/${id}/submissions/${submissionId}`, {
              method: 'PUT',
              body: JSON.stringify({ 
                  status, 
                  score: status === 'ACCEPTED' ? scoreVal : 0 
              })
          });
          
          setSubmissions(submissions.map(s => 
              s.id === submissionId 
                  ? { ...s, status, score: status === 'ACCEPTED' ? scoreVal : 0 }
                  : s
          ));
          setGradeScore('');
          setGradingId(null);
          setSelectedSubmission(null);
      } catch (err: any) {
          alert(err.message);
          setGradingId(null);
      }
  };

  if (loading) return <div className="text-white p-8">Loading submissions...</div>;
  if (error) return <div className="text-red-400 p-8">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
        <div className="mb-8">
            <Link href={`/tournaments/${id}`} className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors mb-4">
                <ArrowLeft size={16} /> Back to Protocol
            </Link>
            <h1 className="text-3xl font-bold text-white">Submitted Solutions</h1>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-white/5 uppercase font-bold text-xs">
                    <tr>
                        <th className="p-4 text-white">Operative</th>
                        <th className="p-4 text-white">Timestamp</th>
                        <th className="p-4 text-white">Language</th>
                        <th className="p-4 text-white">Status</th>
                        <th className="p-4 text-white">Score</th>
                        <th className="p-4 text-white text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {submissions.map(s => (
                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">{s.user.username}</td>
                            <td className="p-4">{new Date(s.createdAt).toLocaleString()}</td>
                            <td className="p-4 font-mono text-xs">{s.language}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                                    s.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    s.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {s.status}
                                </span>
                            </td>
                            <td className="p-4 font-mono text-white">{s.score !== null ? s.score : '-'}</td>
                            <td className="p-4 text-right flex items-center justify-end gap-2">
                                <button 
                                    onClick={() => setSelectedSubmission(s)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-indigo-400 transition-colors"
                                    title="View Code"
                                >
                                    <Code size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {submissions.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500">No submissions intercepted yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Code View & Grading Modal */}
        {selectedSubmission && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col relative">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText size={20} className="text-indigo-500" />
                                Source Code: {selectedSubmission.user.username}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 font-mono">
                                {new Date(selectedSubmission.createdAt).toLocaleString()} • {selectedSubmission.language}
                            </p>
                        </div>
                        <button onClick={() => setSelectedSubmission(null)} className="text-gray-500 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-6 bg-[#050505]">
                        <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                            {selectedSubmission.code}
                        </pre>
                    </div>

                    <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <input 
                                type="number" 
                                placeholder="Score" 
                                value={gradeScore}
                                onChange={(e) => setGradeScore(e.target.value)}
                                className="bg-black border border-white/10 rounded-lg px-4 py-2 text-white w-24 focus:border-indigo-500 outline-none"
                            />
                            <button 
                                onClick={() => handleGrade(selectedSubmission.id, 'ACCEPTED')}
                                disabled={gradingId === selectedSubmission.id}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                            >
                                <Check size={16} /> Accept
                            </button>
                            <button 
                                onClick={() => handleGrade(selectedSubmission.id, 'REJECTED')}
                                disabled={gradingId === selectedSubmission.id}
                                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                            >
                                <X size={16} /> Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
