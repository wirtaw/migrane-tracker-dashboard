import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';
import { env } from '../config/env';
import { ProfileSettingsData } from '../models/profileData.types';
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  profileSettingsData: ProfileSettingsData;
  setProfileSettingsData: React.Dispatch<React.SetStateAction<ProfileSettingsData>>;
  profileLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userExists = async (supabase: SupabaseClient, userId: string) => {
  const { data: users, error } = await supabase
    .from('migrane_tracker-users')
    .select('user_id,email,username')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return users;
};

const fetchUserData = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('migrane_tracker-users')
    .select('birthdate, latitude, longitude, salt, key, isSecurityFinished')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    return null; // Return null to indicate an error
  }

  return data;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileSettingsData, setProfileSettingsData] = useState<ProfileSettingsData>({
    birthDate: '',
    latitude: '',
    longitude: '',
    emailNotifications: false,
    dailySummary: false,
    personalHealthData: true,
    userId: '',
    profileFilled: false,
    securitySetup: false,
    salt: '',
    key: '',
    fetchDataErrors: {
      forecast: '',
      magneticWeather: '',
    },
  });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      throw new Error('Problem to connect supbase');
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);

      if (!supabase) {
        throw new Error('Problem to connect supbase');
      }

      if (_event === 'INITIAL_SESSION') {
        // handle initial session
      } else if (_event === 'SIGNED_IN') {
        const users = await userExists(supabase, session?.user.id);
        console.info(`SIGNED_IN`);
        if (!users?.length) {
          const { error: error2 } = await supabase
            .from('migrane_tracker-users')
            .insert([
              {
                user_id: session?.user.id,
                email: session?.user?.email,
              },
            ])
            .select();

          if (error2) {
            setSession(null);
            throw error2;
          }

          //console.dir(inserted);
        } else {
          setProfileLoading(true);
          const userData = await fetchUserData(supabase, session?.user.id);

          if (userData) {
            setProfileSettingsData({
              ...profileSettingsData,
              birthDate: userData.birthdate?.toString() || '',
              latitude: userData.latitude?.toString() || '',
              longitude: userData.longitude?.toString() || '',
              profileFilled: !!userData.birthdate && !!userData.latitude && !!userData.longitude, // Improved check
            });
          }
          setProfileLoading(false);
        }
        // handle sign in event
      } else if (_event === 'SIGNED_OUT') {
        // handle sign out event
        setSession(null);
        window.location.href = '/';
      } else if (_event === 'PASSWORD_RECOVERY') {
        // handle password recovery event
      } else if (_event === 'TOKEN_REFRESHED') {
        // handle token refreshed event
      } else if (_event === 'USER_UPDATED') {
        // handle user updated event
      }
    });

    return () => subscription.unsubscribe();
  }, [profileSettingsData, setProfileSettingsData]);

  const signInWithGithub = async () => {
    if (!supabase) {
      throw new Error('Problem to connect supbase');
    }

    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: env.REDIRECT_URL || window.location.origin + '/index',
      },
    });
  };

  /*const signInWithEmail = async () => {
    if (!supabase) {
      throw new Error('Problem to connect supbase');
    }

    await supabase.auth.signInAnonymously({
      options: {
        captchaToken: 'test',
      },
    });
  };*/

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error('Problem to connect supbase');
    }

    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Problem to connect supbase');
    }

    if (!session) {
      throw new Error('Problem find the session');
    }

    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      throw new Error('Problem to connect supbase');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGithub,
        signInWithGoogle,
        signOut,
        profileSettingsData,
        setProfileSettingsData,
        profileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
