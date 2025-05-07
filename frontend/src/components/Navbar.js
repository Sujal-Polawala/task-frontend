'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken, clearToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) {
      setLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUsername(decoded.name || decoded.username || 'User');
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  if (!loggedIn) return null;

  return (
    <nav className="backdrop-blur-md bg-zinc-900/80 border-b border-zinc-700 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left: Branding and Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-teal-400 hover:text-teal-300 transition duration-200">
            🧩 TaskDash
          </Link>
          <Link href="/" className="text-gray-300 hover:text-white text-sm uppercase tracking-wide">
            Dashboard
          </Link>
          <Link href="/tasks/create" className="text-gray-300 hover:text-white text-sm uppercase tracking-wide">
            Create Task
          </Link>
        </div>

        {/* Right: User and Logout */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300 italic">👋 Welcome, {username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition duration-300 hover:cursor-pointer"
            title='Logout'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
