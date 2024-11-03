import { env } from '../config/env';

interface WeatherResponse {
  alerts: Array<{
    description: string;
    start: number;
    end: number;
    event: string;
    sender_name: string;
  }>;
  current: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
    clouds: number;
    uvi: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  feels_like: number;
  clouds: number;
  uvi: number;
  description: string;
  icon: string;
  alerts: Array<{
    description: string;
    start: number;
    end: number;
    event: string;
    sender_name: string;
  }>
}

export interface GeophysicalWeatherData {
  solarFlux: number;
  aIndex: number;
  kIndex: number;
  pastSpaceWeather: string | null;
  nextSpaceWeather: string | null;
}

const OPEN_WEATHER_BASE_URL: string = 'https://api.openweathermap.org/data/3.0';
const NOAA_GOV_CURRENT_BASE_URL: string = 'https://services.swpc.noaa.gov/text/wwv.txt';

function parseGeophysicalAlert(text: string): GeophysicalWeatherData {
  const result: GeophysicalWeatherData = {
    solarFlux: 0,
    aIndex: 0,
    kIndex: -1,
    pastSpaceWeather: '',
    nextSpaceWeather: ''
  };

  if (!text) {
    return result;
  }

  const lines = text.split('\n');

  if (!lines.length) {
    return result;
  }
  
  // Extract solar flux and A-index
  const solarFluxLine: string | undefined = lines.find(line => line.includes('Solar flux'));
  const solarFluxMatch = (solarFluxLine) ? solarFluxLine.match(/Solar flux (\d+) and estimated planetary A-index (\d+)/) : null;
  if (solarFluxMatch) {
    result.solarFlux = parseInt(solarFluxMatch[1], 10);
    result.aIndex = parseInt(solarFluxMatch[2], 10);
  }

  // Extract K-index
  const kIndexLine: string | undefined = lines.find(line => line.includes('K-index'));
  const kIndexMatch = (kIndexLine) ? kIndexLine.match(/K-index at \d+ UTC on \d+ \w+ was (\d+\.\d+)/) : null;
  if (kIndexMatch) {
    result.kIndex = parseFloat(kIndexMatch[1]);
  }

  // Extract space weather summaries
  const pastSpaceWeatherLine: string | undefined = lines.find(line => line.startsWith('Space weather for the past 24 hours'));
  result.pastSpaceWeather = (pastSpaceWeatherLine) ? pastSpaceWeatherLine.split(' has been ')[1].trim().replace('.', '') : null;

  const nextSpaceWeatherLine: string | undefined = lines.find(line => line.startsWith('Space weather for the next 24 hours'));
  result.nextSpaceWeather = (nextSpaceWeatherLine) ? nextSpaceWeatherLine.split(' is predicted to be ')[1].trim().replace('.', '') : null;

  return result;
}

export async function fetchWeatherData(): Promise<WeatherData> {
  try {
      const response = await fetch(
        `${OPEN_WEATHER_BASE_URL}/onecall?lat=${env.LATITUDE}&lon=${env.LONGITUDE}&units=${env.WEATHER_UNITS}&exclude=hourly,daily&appid=${env.OPEN_WEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
  
      const data: WeatherResponse = await response.json();

      const weather: WeatherData = {
        temperature: Math.round(data.current.temp),
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        feels_like: Math.round(data.current.feels_like),
        clouds: data.current.clouds,
        uvi: data.current.uvi,
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        alerts: data.alerts,
      };
  
      return weather;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchGeophysicalWeatherData(): Promise<GeophysicalWeatherData> {
  const responseGeoActivity = await fetch(NOAA_GOV_CURRENT_BASE_URL);
  
  if (!responseGeoActivity.ok) {
    throw new Error('Weather data fetch failed');
  }

  const geoActivityData: string = await responseGeoActivity.text();

  const geoActivityDataMapped: GeophysicalWeatherData = parseGeophysicalAlert(geoActivityData);

  return geoActivityDataMapped;
}