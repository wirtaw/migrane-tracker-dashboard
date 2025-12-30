import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Brain, Moon, Sun } from 'lucide-react';
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
                <svg
                  viewBox="0 0 256 250"
                  width="256"
                  height="250"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                  className="h-5 w-5"
                >
                  <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z" />
                </svg>
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
                <svg
                  className="h-5 w-5"
                  width="256"
                  height="262"
                  viewBox="0 0 256 262"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  />
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  />
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  />
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  />
                </svg>
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
