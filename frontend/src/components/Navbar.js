'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken, clearToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';
import { Menu, X } from 'lucide-react'; // Optional icons if using lucide-react

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
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
    <nav className="bg-zinc-900/80 border-b border-zinc-700 shadow-md sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Branding */}
        <Link
          href="/"
          className="text-xl font-bold text-teal-400 hover:text-teal-300 transition duration-200"
        >
          🧩 TaskDash
        </Link>

        {/* Hamburger for mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white text-sm uppercase">
            Dashboard
          </Link>
          <Link href="/tasks/create" className="text-gray-300 hover:text-white text-sm uppercase">
            Create Task
          </Link>
          <span className="text-sm text-gray-300 italic hidden md:inline">👋 {username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition duration-300 hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-6 pb-4 space-y-3">
          <Link href="/" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white text-sm uppercase">
            Dashboard
          </Link>
          <Link href="/tasks/create" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white text-sm uppercase">
            Create Task
          </Link>
          <span className="block text-sm text-gray-300 italic">👋 {username}</span>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
