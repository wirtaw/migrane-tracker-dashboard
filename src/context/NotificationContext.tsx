import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { NotificationResponse } from '../models/predictions.types';
import { fetchNotifications, markNotificationAsRead } from '../services/predictions';

interface INotificationContextType {
  notifications: NotificationResponse[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<INotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { apiSession, user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // State to track if the promotion was dismissed in the current session
  const [promoDismissed, setPromoDismissed] = useState(false);

  // DEVELOPER NOTE: To permanently remove the Migraine Pulse promotion,
  // remove the 'promoNotification' object and its usage in the return block.
  const promoNotification = {
    id: 'migraine-pulse-promo',
    message:
      'Migraine Tracker is the open-source engine behind Migraine Pulse. If you are looking for a hassle-free, hosted solution with unlimited storage and premium features, check out our official paid plans!',
    link: 'https://migrainepulse.com',
    type: 'promo',
  };

  const loadNotifications = async () => {
    if (!apiSession?.accessToken) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(apiSession.accessToken);
      setNotifications(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiSession?.accessToken) {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSession]);

  const markAsRead = async (id: string) => {
    if (!apiSession?.accessToken) return;

    try {
      // Optimistic UI update
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));

      await markNotificationAsRead(id, apiSession.accessToken);
    } catch (err: unknown) {
      // Revert upon failure
      console.error('Failed to mark notification as read:', err);
      loadNotifications();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length + (promoDismissed ? 0 : 1),
        loading,
        error,
        markAsRead,
        refreshNotifications: loadNotifications,
      }}
    >
      {!promoDismissed && user && (
        <div className="bg-indigo-600 text-white p-3 text-center relative text-sm">
          {promoNotification.message}
          <a href={promoNotification.link} target="_blank" className="underline ml-1 font-bold">
            Learn More
          </a>
          <button
            onClick={() => setPromoDismissed(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2"
          >
            ✕
          </button>
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
