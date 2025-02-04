import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Github, Chrome, Brain, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeContextMain, { ThemeProviderMain } from './../context/ThemeContextMain';
import { System } from './../config/constants';

export default function SignIn() {
  const { user, signInWithGithub, signInWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContextMain);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isInitiallyMobile, setIsInitiallyMobile] = useState<boolean>(
      window.innerWidth < System.MobileWidth
    );
    const [isMobileNavActive, setIsMobileNavActive] = useState<boolean>(
      window.innerWidth < System.MobileWidth
    );

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
      setIsMobileNavActive(!isMobileNavActive);
    };

    useEffect(() => {
      const handleResize = () => {
        const isCurrentlyMobile = window.innerWidth < System.MobileWidth;
        setIsInitiallyMobile(isCurrentlyMobile);
        if (!isCurrentlyMobile && isMobileNavActive) {
          setIsMobileNavActive(false);
          setIsMobileMenuOpen(false);
        } else if (isCurrentlyMobile && !isMobileNavActive && isMobileMenuOpen) {
          setIsMobileNavActive(true);
        } else if (isCurrentlyMobile && isInitiallyMobile) {
          setIsMobileNavActive(true);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, [isMobileNavActive, isInitiallyMobile, isMobileMenuOpen]);

    return (
      <header
        className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800 text-gray-300'} p-4`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold">{System.Content.Title}</h1>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition dark:text-gray-400 dark:hover:text-gray-500 dark:focus:bg-gray-800 md:hidden"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className="hidden h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <nav
            className={`items-center gap-4 ${isMobileMenuOpen && isMobileNavActive ? 'flex-col' : 'hidden'} md:flex`}
          >
            <button
              onClick={toggleTheme}
              className={`group relative flex justify-center border border-transparent text-sm font-medium rounded-md bg-white text-blue-500 dark:text-white dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors ${isMobileMenuOpen && isMobileNavActive ? 'w-full py-6' : ''}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </nav>
        </div>
      </header>
    );
  };

  const AuthForm = () => {
    return (
      <div className="min-h-screen sm:min-h-1/3 flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={signInWithGithub}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Github className="h-5 w-5" />
              </span>
              Continue with GitHub
            </button>
          </div>
          <div className="mt-8 space-y-6">
            <button
              onClick={signInWithGoogle}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Chrome className="h-5 w-5" />
              </span>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Footer = () => {
    const { theme } = useContext(ThemeContextMain);
    const currentYear = new Date().getFullYear();

    return (
      <footer
        className={`bg-${theme === 'light' ? 'blue-500 text-white' : 'gray-800 text-gray-300'} shadow-sm mt-auto`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm dark:text-gray-400">
              © {currentYear} Migraine Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  };

  return (
    <ThemeProviderMain>
      <div className="bg-gary-200 dark:bg-gray-800">
        <Header />
        <AuthForm />
        <Footer />
      </div>
    </ThemeProviderMain>
  );
}
