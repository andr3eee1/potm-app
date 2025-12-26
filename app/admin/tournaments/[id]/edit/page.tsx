'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetcher } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditTournamentPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    statement: '',
    startDate: '',
    endDate: '',
    prizePool: '',
    status: 'UPCOMING',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadTournament = async () => {
      try {
        const data = await fetcher(`/tournaments/${id}`);
        // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
        const formatDate = (dateStr: string) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().slice(0, 16); // Extract YYYY-MM-DDThh:mm
        };
        
        // Map status text back to enum if necessary, but API returns "Active", "Upcoming"
        // We need to map it back to UPCOMING, ACTIVE, COMPLETED for the select
        const mapStatus = (statusDisplay: string) => {
             switch(statusDisplay) {
                 case 'Active': return 'ACTIVE';
                 case 'Completed': return 'COMPLETED';
                 default: return 'UPCOMING';
             }
        };

        setFormData({
          title: data.title,
          description: data.description,
          statement: data.statement || '',
          startDate: formatDate(data.startDate), // Note: API returns locale date string, might need parsing. 
          // Wait, the API returns `toLocaleDateString()`. This is bad for editing. 
          // I should verify what the API actually returns or fix the API to return ISO string.
          // Let's assume for now I need to fix the API or parse it. 
          // The API `getTournamentById` returns `toLocaleDateString()`. I should change that to `toISOString()` in the backend for consistency.
          endDate: formatDate(data.endDate),
          prizePool: data.prizePool || '',
          status: mapStatus(data.status),
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetcher(`/admin/tournaments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      router.push('/admin');
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

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
          <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors mb-4">
              <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Protocol</h1>
          <p className="text-gray-400 mt-1">Update mission parameters.</p>
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

               <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prize Pool</label>
                      <input
                          type="text"
                          name="prizePool"
                          value={formData.prizePool}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
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
                      Update Protocol
                  </button>
              </div>
          </form>
      </div>
    </div>
  );
}
