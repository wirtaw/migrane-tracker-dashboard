import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, PowerOff, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { System } from '../config/constants.ts';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isInitiallyMobile, setIsInitiallyMobile] = useState<boolean>(
    window.innerWidth < System.MobileWidth
  );
  const [isMobileNavActive, setIsMobileNavActive] = useState<boolean>(
    window.innerWidth < System.MobileWidth
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `py-2 rounded-lg transition-colors flex items-center ${
      isMobileMenuOpen || isMobileNavActive ? 'w-full' : 'px-4'
    } ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;
  const { signOut } = useAuth();

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

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-dropdown-container')) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {System.Content.Title}
            </h1>
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
            <NavLink to="/index" className={navLinkClass} end>
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

            <div className="relative notifications-dropdown-container">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg rtl:left-0 rtl:right-auto z-50 border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 10).map(notification => (
                        <div
                          key={notification._id}
                          onClick={() => {
                            if (!notification.isRead) markAsRead(notification._id);
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            !notification.isRead
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-1">
                              <p
                                className={`text-sm ${!notification.isRead ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                              >
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString(undefined, {
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                })}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 mt-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle
              className={`flex items-center ${isMobileMenuOpen && isMobileNavActive ? 'w-full py-6' : ''}`}
            />
            <button
              onClick={signOut}
              className={`group relative w-full flex justify-center border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 transition-colors flex items-center ${isMobileMenuOpen && isMobileNavActive ? 'w-full py-6' : ''}`}
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
