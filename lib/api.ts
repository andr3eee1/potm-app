const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetcher(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    const errorMessage = typeof error.message === 'object' ? JSON.stringify(error.message) : error.message;
    throw new Error(errorMessage || 'An error occurred');
  }

  return res.json();
}
