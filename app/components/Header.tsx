'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    
    // Listen for storage changes to update UI across tabs or after login
    const handleStorageChange = () => {
        const updatedUser = localStorage.getItem('user');
        setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const initials = user 
    ? (user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : user.email[0].toUpperCase())
    : '?';

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
      <div className="lg:hidden flex items-center gap-3">
         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
         <span className="font-black text-xl tracking-tight">POTM</span>
      </div>
      <div className="hidden lg:block text-sm font-medium text-slate-500">
        {user ? (
            <>Welcome back, <span className="text-slate-900 dark:text-white font-bold">{user.name || user.email}</span></>
        ) : (
            <>Welcome to <span className="text-slate-900 dark:text-white font-bold">POTM</span></>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
            <button 
                onClick={handleLogout}
                className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors mr-2"
            >
                Logout
            </button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-full h-full flex items-center justify-center font-bold text-sm">
                {initials}
            </div>
          </div>
          {user && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
        </div>
      </div>
    </header>
  );
}
