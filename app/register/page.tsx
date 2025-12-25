'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetcher } from '@/lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
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
    <div className="flex min-h-screen items-center justify-center bg-[#050505] relative overflow-hidden p-4">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl border border-white/10">
            <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg mb-4">P</div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Initialize Access</h2>
                <p className="text-gray-400 mt-2 text-sm">Create a new operative profile.</p>
            </div>
            
            {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Codename</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Agent Smith"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Identity</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="operative@potm.com"
                required
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Set Security Key</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="••••••••"
                required
                />
            </div>
            
            <button
                type="submit"
                className="w-full bg-white text-black font-bold rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors shadow-lg shadow-white/5 mt-2"
            >
                Create Profile
            </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
            Already authorized?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Access Terminal
            </Link>
            </p>
        </div>
      </div>
    </div>
  );
}