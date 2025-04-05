import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';
import { env } from '../config/env';
import {
  IProfileSettingsData,
  ILocationData,
  IForecastHistoricalParams,
  ISolarHistoricalParams,
} from '../models/profileData.types';
import {
  WeatherData,
  GeophysicalWeatherData,
  fetchOpenMeteoWeatherData,
  fetchGeophysicalWeatherData,
  fetchOpenMeteoWeatherDataHistorical,
  fetchGeophysicalWeatherDataHistorical,
  RadiationTodayData,
  fetchRadiationWeatherData,
} from '../services/weather.ts';
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  profileSettingsData: IProfileSettingsData;
  setProfileSettingsData: React.Dispatch<React.SetStateAction<IProfileSettingsData>>;
  profileLoading: boolean;
  weatherLoading: boolean;
  geoMagneticLoading: boolean;
  setWeatherLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setGeoMagneticLoading: React.Dispatch<React.SetStateAction<boolean>>;
  forecastData: WeatherData | undefined;
  geomagneticData: GeophysicalWeatherData | undefined;
  fetchForecast: (params: IProfileSettingsData) => Promise<void>;
  fetchGeomagnetic: () => Promise<void>;
  forecastError: string;
  geoMagneticError: string;
  locationDataList: ILocationData[];
  setLocationDataList: React.Dispatch<React.SetStateAction<ILocationData[]>>;
  fetchForecastHistorical: (params: IForecastHistoricalParams) => Promise<WeatherData | undefined>;
  fetchGeomagneticHistorical: (
    params: ISolarHistoricalParams
  ) => Promise<GeophysicalWeatherData | undefined>;
  fetchSolarRadiation: (params: IProfileSettingsData) => Promise<void>;
  solarRadiationData: RadiationTodayData[] | undefined;
  solarRadiationLoading: boolean;
  solarRadiationError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userExists = async (supabase: SupabaseClient, userId: string | undefined) => {
  const { data: users, error } = await supabase
    .from('migrane_tracker-users')
    .select('user_id,email,username')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return users;
};

const fetchUserData = async (supabase: SupabaseClient, userId: string | undefined) => {
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

const fetchForecastData = async (latitude: string, longitude: string) => {
  try {
    const response: WeatherData = await fetchOpenMeteoWeatherData({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
    return response;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return;
  }
};

const fetchGeomagneticData = async () => {
  try {
    const response: GeophysicalWeatherData = await fetchGeophysicalWeatherData();
    return response;
  } catch (error) {
    console.error('Error fetching geomagnetic data:', error);
    return;
  }
};

const fetchForecastDataHistorical = async (latitude: number, longitude: number, dateTime: Date) => {
  try {
    const response: WeatherData | undefined = await fetchOpenMeteoWeatherDataHistorical({
      latitude,
      longitude,
      dateTime,
    });
    return response;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return;
  }
};

const fetchGeomagneticDataHistorical = async (dateTime: Date) => {
  try {
    const response: GeophysicalWeatherData = await fetchGeophysicalWeatherDataHistorical(dateTime);
    return response;
  } catch (error) {
    console.error('Error fetching geomagnetic data:', error);
    return;
  }
};

const fetchSolarRadiationData = async (latitude: number, longitude: number) => {
  try {
    const response: RadiationTodayData[] = await fetchRadiationWeatherData({
      latitude,
      longitude,
    });
    return response;
  } catch (error) {
    console.error('Error fetching solar radiation data:', error);
    return;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
    salt: '',
    key: '',
    fetchDataErrors: {
      forecast: '',
      magneticWeather: '',
    },
    fetchMagneticWeather: false,
    fetchWeather: false,
  });
  const [forecastData, setForecastData] = useState<WeatherData | undefined>(undefined);
  const [geomagneticData, setGeomagneticData] = useState<GeophysicalWeatherData | undefined>(
    undefined
  );
  const [solarRadiationData, setSolarRadiationData] = useState<RadiationTodayData[] | undefined>(
    undefined
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [geoMagneticLoading, setGeoMagneticLoading] = useState(false);
  const [solarRadiationLoading, setSolarRadiationLoading] = useState(false);
  const [forecastError, setForecastError] = useState<string>('');
  const [geoMagneticError, setGeoMagneticError] = useState<string>('');
  const [solarRadiationError, setSolarRadiationError] = useState<string>('');
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
        const users = await userExists(supabase, session?.user.id);
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
              profileFilled: !!userData.birthdate && !!userData.latitude && !!userData.longitude,
            });

            const { latitude, longitude } = userData;

            if (latitude && longitude) {
              const cachedForecast = sessionStorage.getItem(`forecast_${session?.user.id}`);
              const cachedGeomagnetic = sessionStorage.getItem(`geomagnetic_${session?.user.id}`);
              const cachedSolarRadiation = sessionStorage.getItem(
                `solar_radiation_${session?.user.id}`
              );

              if (cachedForecast) {
                setForecastData(JSON.parse(cachedForecast));
              } else {
                const forecast = await fetchForecastData(latitude, longitude);

                if (forecast) {
                  setForecastData(forecast);
                  sessionStorage.setItem(`forecast_${session?.user.id}`, JSON.stringify(forecast));
                }
              }

              if (cachedGeomagnetic) {
                setGeomagneticData(JSON.parse(cachedGeomagnetic));
              } else {
                const geomagnetic = await fetchGeomagneticData();

                if (geomagnetic) {
                  setGeomagneticData(geomagnetic);
                  sessionStorage.setItem(
                    `geomagnetic_${session?.user.id}`,
                    JSON.stringify(geomagnetic)
                  );
                }
              }

              if (cachedSolarRadiation) {
                setSolarRadiationData(JSON.parse(cachedSolarRadiation));
              } else {
                const solar = await fetchSolarRadiationData(latitude, longitude);
                if (solar) {
                  setSolarRadiationData(solar);
                  sessionStorage.setItem(
                    `solar_radiation_${session?.user.id}`,
                    JSON.stringify(solar)
                  );
                }
              }
            }
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
        setWeatherLoading(true);
        const forecast = await fetchForecastData(
          profileSettingsData.latitude,
          profileSettingsData.longitude
        );
        setForecastData(forecast);
        if (forecast) {
          sessionStorage.setItem(`forecast_${user?.id}`, JSON.stringify(forecast));
        }
        setWeatherLoading(false);
      }
    } catch (err) {
      const errMessage: string = `Failed to fetch weather data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setForecastError(errMessage);
    }
  };

  const fetchGeomagnetic = async () => {
    try {
      setGeoMagneticLoading(true);
      const geomagnetic = await fetchGeomagneticData();
      setGeomagneticData(geomagnetic);
      if (geomagnetic) {
        sessionStorage.setItem(`geomagnetic_${user?.id}`, JSON.stringify(geomagnetic));
      }
      setGeoMagneticLoading(false);
    } catch (err) {
      const errMessage: string = `Failed to fetch geomagnetic activity data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setGeoMagneticError(errMessage);
    }
  };

  const fetchForecastHistorical = async (forecastHistoricalParams: IForecastHistoricalParams) => {
    try {
      if (forecastHistoricalParams.latitude && forecastHistoricalParams.longitude) {
        const forecast = await fetchForecastDataHistorical(
          forecastHistoricalParams.latitude,
          forecastHistoricalParams.longitude,
          forecastHistoricalParams.dateTime
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
      const geomagnetic = await fetchGeomagneticDataHistorical(solarHistoricalParams.dateTime);

      return geomagnetic;
    } catch (err) {
      const errMessage: string = `Failed to fetch geomagnetic activity data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setGeoMagneticError(errMessage);
    }
  };

  const fetchSolarRadiation = async (profileSettingsData: IProfileSettingsData) => {
    try {
      if (profileSettingsData.latitude && profileSettingsData.longitude) {
        setSolarRadiationLoading(true);
        const solar = await fetchSolarRadiationData(
          parseFloat(profileSettingsData.latitude),
          parseFloat(profileSettingsData.longitude)
        );

        if (solar) {
          setSolarRadiationData(solar);
          sessionStorage.setItem(`solar_radiation_${user?.id}`, JSON.stringify(solar));
        }
        setSolarRadiationLoading(false);
      }
    } catch (err) {
      const errMessage: string = `Failed to fetch solar radiation data. ${JSON.stringify(err)}`;
      console.error(new Error(errMessage));
      setSolarRadiationError(errMessage);
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
        weatherLoading,
        geoMagneticLoading,
        setWeatherLoading,
        setGeoMagneticLoading,
        forecastData,
        geomagneticData,
        fetchForecast,
        fetchGeomagnetic,
        forecastError,
        geoMagneticError,
        locationDataList,
        setLocationDataList,
        fetchForecastHistorical,
        fetchGeomagneticHistorical,
        fetchSolarRadiation,
        solarRadiationData,
        solarRadiationLoading,
        solarRadiationError,
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
