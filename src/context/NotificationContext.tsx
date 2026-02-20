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
  const { apiSession } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        refreshNotifications: loadNotifications,
      }}
    >
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
