import { fetchWeatherApi } from 'openmeteo';
import { env } from '../config/env';

interface OpenMeteoParams {
  latitude: number;
  longitude: number;
  current: Array<string>;
  daily: Array<string>;
  timezone: string;
  wind_speed_unit: string;
}

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
    }>;
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
  }>;
}

export interface GeophysicalWeatherData {
  solarFlux: number;
  aIndex: number;
  kIndex: number;
  pastWeather: { level: string };
  nextWeather: { level: string };
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

const OPEN_WEATHER_BASE_URL: string = env.OPEN_WEATHER_BASE_URL;
const NOAA_GOV_CURRENT_BASE_URL: string = env.NOAA_GOV_CURRENT_BASE_URL;
const OPEN_METEO_BASE_URL: string = env.OPEN_METEO_BASE_URL;

function parseGeophysicalAlert(text: string): GeophysicalWeatherData {
  const result: GeophysicalWeatherData = {
    solarFlux: 0,
    aIndex: 0,
    kIndex: -1,
    pastWeather: { level: '' },
    nextWeather: { level: '' },
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
  const solarFluxMatch = solarFluxLine
    ? solarFluxLine.match(/Solar flux (\d+) and estimated planetary A-index (\d+)/)
    : null;
  if (solarFluxMatch) {
    result.solarFlux = parseInt(solarFluxMatch[1], 10);
    result.aIndex = parseInt(solarFluxMatch[2], 10);
  }

  // Extract K-index
  const kIndexLine: string | undefined = lines.find(line => line.includes('K-index'));
  const kIndexMatch = kIndexLine
    ? kIndexLine.match(/K-index at \d+ UTC on \d+ \w+ was (\d+\.\d+)/)
    : null;
  if (kIndexMatch) {
    result.kIndex = parseFloat(kIndexMatch[1]);
  }

  // Extract space weather summaries
  const pastSpaceWeatherLine: string | undefined = lines.find(line =>
    line.startsWith('Space weather for the past 24 hours')
  );
  result.pastWeather.level = pastSpaceWeatherLine
    ? pastSpaceWeatherLine.split(' has been ')[1].trim().replace('.', '')
    : '';

  const nextSpaceWeatherLine: string | undefined = lines.find(line =>
    line.startsWith('Space weather for the next 24 hours')
  );
  result.nextWeather.level = nextSpaceWeatherLine
    ? nextSpaceWeatherLine.split(' is predicted to be ')[1].trim().replace('.', '')
    : '';

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

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export async function fetchOpenMeteoWeatherData({
  latitude,
  longitude,
}: Coordinates): Promise<WeatherData> {
  try {
    const params: OpenMeteoParams = {
      latitude: latitude,
      longitude: longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'rain',
        'showers',
        'weather_code',
        'cloud_cover',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ],
      daily: ['uv_index_max', 'precipitation_sum', 'rain_sum'],
      wind_speed_unit: 'ms',
      timezone: 'Europe/Vilnius',
    };
    const responses = await fetchWeatherApi(OPEN_METEO_BASE_URL, params);

    if (!responses) {
      throw new Error('Weather data fetch failed');
    }

    const [response] = responses;

    const current = response.current()!;
    const daily = response.daily()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const time = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
      t => new Date((t + utcOffsetSeconds) * 1000)
    );

    const uvIndexMax = daily.variables(0)!.valuesArray()!;

    const weather: WeatherData = {
      temperature: Math.round(current.variables(0)!.value()),
      humidity: current.variables(1)!.value(),
      pressure: Math.round(current.variables(8)!.value()),
      feels_like: Math.round(current.variables(2)!.value()),
      clouds: current.variables(7)!.value(),
      uvi: Math.round(uvIndexMax.reduce((acc, prev) => acc + prev, 0) / time.length),
      description: '',
      icon: '',
      alerts: [],
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
