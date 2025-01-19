interface EnvConfig {
  OPEN_WEATHER_API_KEY: string;
  WEATHER_UNITS: 'metric' | 'imperial';
  LATITUDE: number;
  LONGITUDE: number;
  BIRTH_DATE: string;
  SUPBASE_URL: string;
  SUPBASE_KEY: string;
  REACT_APP_APPWRITE_PROJECT_ID: string;
}

export const env: EnvConfig = {
  OPEN_WEATHER_API_KEY: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
  WEATHER_UNITS: import.meta.env.VITE_WEATHER_UNITS as 'metric' | 'imperial',
  LATITUDE: Number.parseFloat(import.meta.env.VITE_LATITUDE) || 51.5074,
  LONGITUDE: Number.parseFloat(import.meta.env.VITE_LONGITUDE) || -0.1278,
  BIRTH_DATE: import.meta.env.VITE_BIRTH_DATE || '',
  SUPBASE_URL: import.meta.env.VITE_SUPBASE_URL || '',
  SUPBASE_KEY: import.meta.env.VITE_SUPBASE_KEY || '',
  REACT_APP_APPWRITE_PROJECT_ID: import.meta.env.VITE_REACT_APP_APPWRITE_PROJECT_ID || '',
};
