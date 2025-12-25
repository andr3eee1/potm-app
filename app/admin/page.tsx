'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import { Users, Plus, Gamepad2, Save, X, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  totalPoints: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ role: string; totalPoints: number }>({ role: 'USER', totalPoints: 0 });
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') {
            router.push('/');
        }
    };
    checkAdmin();

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const usersData = await fetcher('/admin/users');
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditForm({ role: user.role, totalPoints: user.totalPoints });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
  };

  const saveEdit = async (userId: number) => {
      try {
          await fetcher(`/admin/users/${userId}`, {
              method: 'PUT',
              body: JSON.stringify(editForm)
          });
          // Optimistic update or reload
          setUsers(users.map(u => u.id === userId ? { ...u, ...editForm } : u));
          setEditingUserId(null);
      } catch (error) {
          console.error("Failed to update user", error);
          alert("Failed to update user");
      }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading admin panel...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-white">Admin Control</h1>
           <p className="text-gray-400 mt-1">System management and user oversight.</p>
        </div>
        <Link href="/admin/tournaments/new" className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_15px_-5px_rgba(255,255,255,0.5)]">
            <Plus size={16} />
            Create Tournament
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* User List */}
         <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <Users size={18} className="text-blue-400" />
               Registered Operatives
            </h2>
            <div className="glass rounded-2xl overflow-hidden">
               <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                       <thead className="bg-white/5 text-gray-400 uppercase font-bold text-xs tracking-wider">
                           <tr>
                               <th className="px-6 py-4">User</th>
                               <th className="px-6 py-4">Role</th>
                               <th className="px-6 py-4 text-right">Points</th>
                               <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                           {users.map(u => (
                               <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                   <td className="px-6 py-4">
                                       <div>
                                           <div className="font-bold text-white">{u.name || 'Unknown'}</div>
                                           <div className="text-gray-500 text-xs">{u.email}</div>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4">
                                       {editingUserId === u.id ? (
                                           <select 
                                               className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 outline-none"
                                               value={editForm.role}
                                               onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                           >
                                               <option value="USER">USER</option>
                                               <option value="ADMIN">ADMIN</option>
                                           </select>
                                       ) : (
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                u.role === 'ADMIN' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                                            )}>
                                                {u.role}
                                            </span>
                                       )}
                                   </td>
                                   <td className="px-6 py-4 text-right font-mono text-indigo-400 font-bold">
                                       {editingUserId === u.id ? (
                                           <input 
                                                type="number"
                                                className="bg-black/50 border border-white/20 rounded px-2 py-1 text-xs text-white w-20 text-right focus:border-indigo-500 outline-none"
                                                value={editForm.totalPoints}
                                                onChange={(e) => setEditForm({...editForm, totalPoints: parseInt(e.target.value) || 0})}
                                           />
                                       ) : (
                                           u.totalPoints
                                       )}
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                       {editingUserId === u.id ? (
                                           <div className="flex items-center justify-end gap-2">
                                               <button onClick={() => saveEdit(u.id)} className="text-green-400 hover:text-green-300 p-1"><Save size={16} /></button>
                                               <button onClick={cancelEdit} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
                                           </div>
                                       ) : (
                                           <button onClick={() => startEdit(u)} className="text-gray-500 hover:text-white transition-colors p-1">
                                               <Edit2 size={16} />
                                           </button>
                                       )}
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
            </div>
         </div>

         {/* Quick Actions / Stats */}
         <div className="flex flex-col gap-4">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <Gamepad2 size={18} className="text-emerald-400" />
               System Status
            </h2>
            <div className="glass rounded-2xl p-6">
                <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Total Users</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Admins</p>
                    <p className="text-3xl font-bold text-purple-400">{users.filter(u => u.role === 'ADMIN').length}</p>
                </div>
                <div>
                     <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Total Global Points</p>
                     <p className="text-3xl font-bold text-indigo-400 font-mono">
                         {users.reduce((acc, curr) => acc + curr.totalPoints, 0)}
                     </p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}