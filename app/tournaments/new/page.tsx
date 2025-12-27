'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateTournamentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    prizePool: '',
    status: 'UPCOMING',
    statement: '',
    difficulty: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Filter out empty strings to allow defaults to kick in if needed, 
      // but for difficulty empty string is N/A effectively if we handle it
      await fetcher('/tournaments', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push('/tournaments');
    } catch (err: any) {
        try {
            const parsed = JSON.parse(err.message);
            if (Array.isArray(parsed)) {
               setError(parsed.map((p: any) => p.message).join(', '));
            } else {
               setError(err.message);
            }
        } catch {
            setError(err.message);
        }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
          <Link href="/tournaments" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors mb-4">
              <ArrowLeft size={16} /> Back to Missions
          </Link>
          <h1 className="text-3xl font-bold text-white">Initialize New Protocol</h1>
          <p className="text-gray-400 mt-1">Configure parameters for a new competitive mission.</p>
      </div>

      <div className="glass rounded-2xl p-8">
          {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
              </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mission Title</label>
                  <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Operation Code Storm"
                      required
                  />
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Briefing details..."
                      required
                  />
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mission Statement (Typst)</label>
                  <textarea
                      name="statement"
                      value={formData.statement}
                      onChange={handleChange}
                      rows={8}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                      placeholder="# Typst content here..."
                  />
              </div>

              <div className="grid grid-cols-2 gap-6">
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
                      <input
                          type="datetime-local"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
                      <input
                          type="datetime-local"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                      />
                  </div>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prize Pool</label>
                      <input
                          type="text"
                          name="prizePool"
                          value={formData.prizePool}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="$1000"
                      />
                  </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Difficulty</label>
                      <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                          <option value="" className="bg-black">N/A</option>
                          <option value="Easy" className="bg-black">Easy</option>
                          <option value="Medium" className="bg-black">Medium</option>
                          <option value="Hard" className="bg-black">Hard</option>
                          <option value="Extreme" className="bg-black">Extreme</option>
                      </select>
                  </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Initial Status</label>
                      <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                          <option value="UPCOMING" className="bg-black">Upcoming</option>
                          <option value="ACTIVE" className="bg-black">Active</option>
                          <option value="COMPLETED" className="bg-black">Completed</option>
                      </select>
                  </div>
               </div>

              <div className="pt-4">
                  <button
                      type="submit"
                      className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors shadow-lg shadow-white/5"
                  >
                      Deploy Protocol
                  </button>
              </div>
          </form>
      </div>
    </div>
  );
}
