'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Trophy, Gamepad2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    
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

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tournaments', label: 'Tournaments', icon: Gamepad2 },
    { href: '/leaderboard', label: 'Hall of Fame', icon: Trophy },
    ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin Panel', icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
               <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
                 P
               </div>
               <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">POTM</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                      isActive 
                        ? "bg-white/10 text-white shadow-inner" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon size={16} className={isActive ? "text-indigo-400" : ""} />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white leading-none">{user.name || user.email}</p>
                    <p className="text-xs text-indigo-400 font-medium mt-1 uppercase tracking-wider">{user.role}</p>
                 </div>
                 <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                    title="Logout"
                 >
                    <LogOut size={18} />
                 </button>
                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                        {(user.name?.[0] || user.email[0]).toUpperCase()}
                    </div>
                 </div>
              </div>
            ) : (
               <div className="flex items-center gap-3">
                 <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                   Login
                 </Link>
                 <Link href="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                   Sign Up
                 </Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}