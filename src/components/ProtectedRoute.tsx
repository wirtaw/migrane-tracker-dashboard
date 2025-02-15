import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const {
    user,
    loading: authLoading,
    profileLoading,
    profileSettingsData,
    setProfileSettingsData,
  } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && user && !profileLoading && !profileSettingsData.profileFilled) {
      setProfileSettingsData({
        ...profileSettingsData,
        profileFilled: true,
      });
    }
  }, [authLoading, user, profileLoading, profileSettingsData, setProfileSettingsData]);

  if (authLoading || profileLoading) {
    return <Loader />;
  }

  if (!user) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
