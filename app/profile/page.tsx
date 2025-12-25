'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      router.replace(`/profile/${user.id}`);
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <div className="flex items-center justify-center min-h-[50vh] text-gray-500">Redirecting...</div>;
}
