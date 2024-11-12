import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, PowerOff } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;
  const { signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Migraine Tracker</h1>
          </div>
          <nav className="flex items-center gap-4">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
            <ThemeToggle />
            <button
              onClick={signOut}
              className="group relative w-full flex justify-center border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center">
                <PowerOff />
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
