import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { env } from '../config/env';
import {
  IProfileSettingsData,
  ILocationData,
  IForecastHistoricalParams,
  ISolarHistoricalParams,
  IApiSession,
} from '../models/profileData.types';
import {
  IWeatherData,
  IGeophysicalWeatherData,
  fetchOpenMeteoWeatherData,
  fetchGeophysicalWeatherData,
  fetchOpenMeteoWeatherDataHistorical,
  fetchGeophysicalWeatherDataHistorical,
  IRadiationTodayData,
  fetchRadiationWeatherData,
} from '../services/weather';
import { syncUserWithBackend, fetchUserProfile } from '../services/migraineApi';
interface IWeatherState {
  data: IWeatherData | undefined;
  loading: boolean;
  error: string;
}

interface IGeomagneticState {
  data: IGeophysicalWeatherData | undefined;
  loading: boolean;
  error: string;
}

interface ISolarRadiationState {
  data: IRadiationTodayData[] | undefined;
  loading: boolean;
  error: string;
}

interface IAuthContextType {
  user: User | null;
  session: Session | null;
  apiSession: IApiSession | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  profileSettingsData: IProfileSettingsData;
  setProfileSettingsData: React.Dispatch<React.SetStateAction<IProfileSettingsData>>;
  profileLoading: boolean;
  weatherState: IWeatherState;
  geomagneticState: IGeomagneticState;
  solarRadiationState: ISolarRadiationState;
  fetchForecast: (params: IProfileSettingsData) => Promise<void>;
  fetchGeomagnetic: () => Promise<void>;
  locationDataList: ILocationData[];
  setLocationDataList: React.Dispatch<React.SetStateAction<ILocationData[]>>;
  fetchForecastHistorical: (params: IForecastHistoricalParams) => Promise<IWeatherData | undefined>;
  fetchGeomagneticHistorical: (
    params: ISolarHistoricalParams
  ) => Promise<IGeophysicalWeatherData | undefined>;
  fetchSolarRadiation: (params: IProfileSettingsData) => Promise<void>;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

const fetchForecastData = async (latitude: string, longitude: string, token?: string) => {
  try {
    const response: IWeatherData = await fetchOpenMeteoWeatherData(
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      token
    );
    return response;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return;
  }
};

const fetchGeomagneticData = async (token?: string) => {
  try {
    const response: IGeophysicalWeatherData = await fetchGeophysicalWeatherData(token);
    return response;
  } catch (error) {
    console.error('Error fetching geomagnetic data:', error);
    return;
  }
};

const fetchForecastDataHistorical = async (
  latitude: number,
  longitude: number,
  dateTime: Date,
  token?: string
) => {
  try {
    const response: IWeatherData | undefined = await fetchOpenMeteoWeatherDataHistorical(
      {
        latitude,
        longitude,
        dateTime,
      },
      token
    );
    return response;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return;
  }
};

const fetchGeomagneticDataHistorical = async (dateTime: Date, token: string) => {
  try {
    const response: IGeophysicalWeatherData = await fetchGeophysicalWeatherDataHistorical(
      dateTime,
      token
    );
    return response;
  } catch (error) {
    console.error('Error fetching geomagnetic data:', error);
    return;
  }
};

const fetchSolarRadiationData = async (latitude: number, longitude: number, token?: string) => {
  try {
    const response: IRadiationTodayData[] = await fetchRadiationWeatherData(
      {
        latitude,
        longitude,
      },
      token
    );
    return response;
  } catch (error) {
    console.error('Error fetching solar radiation data:', error);
    return;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [apiSession, setApiSession] = useState<IApiSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileSettingsData, setProfileSettingsData] = useState<IProfileSettingsData>({
    birthDate: '',
    latitude: '',
    longitude: '',
    emailNotifications: false,
    dailySummary: false,
    personalHealthData: true,
    userId: '',
    profileFilled: false,
    securitySetup: false,

    fetchDataErrors: {
      forecast: '',
      magneticWeather: '',
    },
    fetchMagneticWeather: false,
    fetchWeather: false,
  });

  const [weatherState, setWeatherState] = useState<IWeatherState>({
    data: undefined,
    loading: false,
    error: '',
  });

  const [geomagneticState, setGeomagneticState] = useState<IGeomagneticState>({
    data: undefined,
    loading: false,
    error: '',
  });

  const [solarRadiationState, setSolarRadiationState] = useState<ISolarRadiationState>({
    data: undefined,
    loading: false,
    error: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [locationDataList, setLocationDataList] = useState<ILocationData[]>([]);

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
        setProfileLoading(true);
        if (session?.access_token) {
          try {
            const authResponse = await syncUserWithBackend(session.access_token);
            const userProfile = await fetchUserProfile(authResponse.token);
            const apiSession = {
              accessToken: authResponse.token,
              refreshToken: session.refresh_token,
              expiresAt: session.expires_at || 600,
              userId: session.user.id,
            };
            setApiSession(apiSession);

            setProfileSettingsData({
              ...profileSettingsData,
              birthDate: userProfile.birthDate || '',
              latitude: userProfile.latitude || '',
              longitude: userProfile.longitude || '',
              profileFilled:
                !!userProfile.birthDate && !!userProfile.latitude && !!userProfile.longitude,
            });

            const { latitude, longitude } = userProfile;

            if (latitude && longitude && latitude !== '0' && longitude !== '0') {
              const forecast = await fetchForecastData(latitude, longitude, apiSession.accessToken);

              if (forecast) {
                setWeatherState(prev => ({ ...prev, data: forecast }));
              }

              const geomagnetic = await fetchGeomagneticData(apiSession.accessToken);

              if (geomagnetic) {
                setGeomagneticState(prev => ({ ...prev, data: geomagnetic }));
              }

              const solar = await fetchSolarRadiationData(
                parseFloat(latitude),
                parseFloat(longitude),
                apiSession.accessToken
              );
              if (solar) {
                setSolarRadiationState(prev => ({ ...prev, data: solar }));
              }
            }

            setProfileLoading(false);
          } catch (err) {
            console.error('Failed to sync with backend or fetch profile', err);
            setProfileLoading(false);
          }
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
      options: {
        redirectTo: env.REDIRECT_URL || window.location.origin + '/index',
      },
    });
  };

  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized.');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return;
      }

      setSession(null);
    } catch (error) {
      console.error('An unexpected error occurred during sign out:', error);
    }
  };

  const fetchForecast = async (profileSettingsData: IProfileSettingsData) => {
    try {
      if (profileSettingsData.latitude && profileSettingsData.longitude) {
        setWeatherState(prev => ({ ...prev, loading: true, error: '' }));
        const forecast = await fetchForecastData(
          profileSettingsData.latitude,
          profileSettingsData.longitude,
          apiSession?.accessToken
        );
        setWeatherState(prev => ({
          ...prev,
          data: forecast,
          loading: false,
        }));
      }
    } catch (err) {
      const errMessage: string = `Failed to fetch weather data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setWeatherState(prev => ({ ...prev, error: errMessage, loading: false }));
    }
  };

  const fetchGeomagnetic = async () => {
    try {
      setGeomagneticState(prev => ({ ...prev, loading: true, error: '' }));
      const geomagnetic = await fetchGeomagneticData(apiSession?.accessToken);
      setGeomagneticState(prev => ({
        ...prev,
        data: geomagnetic,
        loading: false,
      }));
    } catch (err) {
      const errMessage: string = `Failed to fetch geomagnetic activity data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setGeomagneticState(prev => ({ ...prev, error: errMessage, loading: false }));
    }
  };

  const fetchForecastHistorical = async (forecastHistoricalParams: IForecastHistoricalParams) => {
    try {
      if (forecastHistoricalParams.latitude && forecastHistoricalParams.longitude) {
        const forecast = await fetchForecastDataHistorical(
          forecastHistoricalParams.latitude,
          forecastHistoricalParams.longitude,
          forecastHistoricalParams.dateTime,
          apiSession?.accessToken
        );
        return forecast;
      }
    } catch (err) {
      const errMessage: string = `Failed to fetch weather data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
    }
  };

  const fetchGeomagneticHistorical = async (solarHistoricalParams: ISolarHistoricalParams) => {
    try {
      if (!apiSession?.accessToken) {
        return;
      }
      const geomagnetic = await fetchGeomagneticDataHistorical(
        solarHistoricalParams.dateTime,
        apiSession.accessToken
      );

      return geomagnetic;
    } catch (err) {
      const errMessage: string = `Failed to fetch geomagnetic activity data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setGeomagneticState(prev => ({ ...prev, error: errMessage }));
    }
  };

  const fetchSolarRadiation = async (profileSettingsData: IProfileSettingsData) => {
    try {
      if (profileSettingsData.latitude && profileSettingsData.longitude) {
        setSolarRadiationState(prev => ({ ...prev, loading: true, error: '' }));
        const solar = await fetchSolarRadiationData(
          parseFloat(profileSettingsData.latitude),
          parseFloat(profileSettingsData.longitude),
          apiSession?.accessToken
        );

        if (solar) {
          setSolarRadiationState(prev => ({
            ...prev,
            data: solar,
            loading: false,
          }));
        } else {
          setSolarRadiationState(prev => ({ ...prev, loading: false }));
        }
      }
    } catch (err) {
      const errMessage: string = `Failed to fetch solar radiation data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setSolarRadiationState(prev => ({ ...prev, error: errMessage, loading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        apiSession,
        loading,
        signInWithGithub,
        signInWithGoogle,
        signOut,
        profileSettingsData,
        setProfileSettingsData,
        profileLoading,
        weatherState,
        geomagneticState,
        solarRadiationState,
        fetchForecast,
        fetchGeomagnetic,
        locationDataList,
        setLocationDataList,
        fetchForecastHistorical,
        fetchGeomagneticHistorical,
        fetchSolarRadiation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
