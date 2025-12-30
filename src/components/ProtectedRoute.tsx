import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && !profileLoading) {
      if (!profileSettingsData.profileFilled) {
        navigate('/profile');
      }
    }
  }, [authLoading, user, profileLoading, profileSettingsData, setProfileSettingsData, navigate]);

  if (authLoading || profileLoading) {
    return <Loader />;
  }

  if (!user) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
