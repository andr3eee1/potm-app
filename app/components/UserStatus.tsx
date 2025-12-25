'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserStatus() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex gap-4">
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium">
          Login
        </Link>
        <Link href="/register" className="bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-md text-sm font-medium">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-white">Hello, {user.name || user.email}</p>
        <p className="text-xs text-gray-300">Role: {user.role}</p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Logout
      </button>
    </div>
  );
}
