'use client';

import { LayoutDashboard, LogOut, User as UserIcon, Shield, Trophy, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/api";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initial check from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Refresh user data from server to check for role updates
    const refreshSession = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const data = await fetcher('/auth/me');
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }
        } catch (error) {
            console.error("Session refresh failed", error);
        }
    };

    refreshSession();
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tournaments', label: 'Tournaments', icon: Gamepad2 },
    { href: '/leaderboard', label: 'Hall of Fame', icon: Trophy },
    ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: 'Admin Panel', icon: LayoutDashboard }] : []),
  ];

  const initials = user 
    ? (user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : user.email[0].toUpperCase())
    : '?';

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
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                    title="Logout"
                 >
                    <LogOut size={18} />
                 </button>
                 <Link href={`/profile/${user.id}`} className="relative group cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                            {initials}
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                 </Link>
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
