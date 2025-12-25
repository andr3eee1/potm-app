import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, Trophy, Gamepad2, Users, Settings } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POTM | Programmer of the Month",
  description: "Join the elite coding tournament and become the programmer of the month.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 min-h-screen flex`}>
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-black text-xl tracking-tight">POTM</span>
          </div>
          
          <nav className="flex-1 p-4 flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/tournaments" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <Gamepad2 size={20} />
              Tournaments
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <Trophy size={20} />
              Hall of Fame
            </Link>
            <Link href="/community" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <Users size={20} />
              Community
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <Settings size={20} />
              Settings
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
            <div className="lg:hidden flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
               <span className="font-black text-xl tracking-tight">POTM</span>
            </div>
            <div className="hidden lg:block text-sm font-medium text-slate-500">
              Welcome back, <span className="text-slate-900 dark:text-white font-bold">Andrei</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-full h-full flex items-center justify-center font-bold text-sm">AP</div>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}