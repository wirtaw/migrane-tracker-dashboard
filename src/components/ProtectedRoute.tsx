import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  /*const userHasRequiredData = () => {
    // Replace with your actual logic to check if birthdate, latitude, and longitude are set
    const birthdate = localStorage.getItem('birthdate');
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');

    return !!birthdate && !!latitude && !!longitude;
  };*/

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/index" replace />;
  }

  return children;
}
