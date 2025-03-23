import { fetchWeatherApi } from 'openmeteo';
import { env } from '../config/env';

interface OpenMeteoParams {
  latitude: number;
  longitude: number;
  current: Array<string>;
  daily: Array<string>;
  wind_speed_unit: string;
}

interface OpenMeteoArchiveParams {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  hourly: Array<string>;
  daily: Array<string> | unknown;
  wind_speed_unit: string;
  timezone: string;
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
  temperature: number | undefined;
  humidity: number | undefined;
  pressure: number | undefined;
  feels_like: number | undefined;
  wind_speed_10m: number | undefined;
  clouds: number | undefined;
  uvi: number | undefined;
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

interface CoordinatesWithDate {
  latitude: number;
  longitude: number;
  dateTime: Date;
}

const OPEN_WEATHER_BASE_URL: string = env.OPEN_WEATHER_BASE_URL;
const NOAA_GOV_CURRENT_BASE_URL: string = env.NOAA_GOV_CURRENT_BASE_URL;
const OPEN_METEO_BASE_URL: string = env.OPEN_METEO_BASE_URL;
const OPEN_METEO_ARCHIVE_URL: string = env.OPEN_METEO_ARCHIVE_URL;

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

export async function fetchWeatherData({ latitude, longitude }: Coordinates): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&units=${env.WEATHER_UNITS}&exclude=hourly,daily&appid=${env.OPEN_WEATHER_API_KEY}`
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
      wind_speed_10m: 0,
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
      latitude,
      longitude,
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
      wind_speed_10m: Math.round(current.variables(9)!.value()),
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

const getDateRange = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const date = dateTime.getDate();

  return `${year}-${month < 9 ? `0${month}` : month}-${date < 9 ? `0${date}` : date}`;
};

export async function fetchOpenMeteoWeatherDataHistorical({
  latitude,
  longitude,
  dateTime,
}: CoordinatesWithDate): Promise<WeatherData | undefined> {
  try {
    if (typeof dateTime === 'undefined') {
      return;
    }
    const params: OpenMeteoArchiveParams = {
      latitude,
      longitude,
      start_date: getDateRange(dateTime),
      end_date: getDateRange(dateTime),
      hourly: [
        'temperature_2m',
        'wind_speed_10m',
        'precipitation',
        'relative_humidity_2m',
        'cloud_cover',
        'pressure_msl_spread',
      ],
      daily: '',
      wind_speed_unit: 'ms',
      timezone: 'auto',
    };
    const responses = await fetchWeatherApi(OPEN_METEO_ARCHIVE_URL, params);

    if (!responses) {
      throw new Error('Weather data fetch failed');
    }

    const [response] = responses;

    const hourly = response.hourly()!;
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const time = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
      t => new Date((t + utcOffsetSeconds) * 1000)
    );

    const temperature2m = hourly.variables(0)!.valuesArray()!;
    const windSpeed10m = hourly.variables(1)!.valuesArray()!;
    const relativeHumidity2m = hourly.variables(3)!.valuesArray()!;
    const cloudCover = hourly.variables(4)!.valuesArray()!;
    const pressureMslSpread = hourly.variables(5)!.valuesArray()!;

    const isTemperatureValuesValid: boolean =
      temperature2m.filter(item => !Number.isNaN(item)).length === temperature2m.length;
    const isWindValuesValid: boolean =
      windSpeed10m.filter(item => !Number.isNaN(item)).length === windSpeed10m.length;
    const isHumidityValuesValid: boolean =
      relativeHumidity2m.filter(item => !Number.isNaN(item)).length === relativeHumidity2m.length;
    const isCloudCoverValuesValid: boolean =
      cloudCover.filter(item => !Number.isNaN(item)).length === cloudCover.length;
    const isPressureValuesValid: boolean =
      pressureMslSpread.filter(item => !Number.isNaN(item)).length === pressureMslSpread.length;

    const weather: WeatherData = {
      temperature: isTemperatureValuesValid
        ? Math.round(temperature2m.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      humidity: isHumidityValuesValid
        ? Math.round(relativeHumidity2m.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      pressure: isPressureValuesValid
        ? Math.round(pressureMslSpread.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      feels_like: undefined,
      wind_speed_10m: isWindValuesValid
        ? Math.round(windSpeed10m.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      clouds: isCloudCoverValuesValid
        ? Math.round(cloudCover.reduce((acc, prev) => acc + prev, 0) / time.length)
        : undefined,
      uvi: undefined,
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

export async function fetchGeophysicalWeatherDataHistorical(
  dateTime: Date
): Promise<GeophysicalWeatherData> {
  console.info(`${dateTime.toISOString()}`);
  const responseGeoActivity = await fetch(NOAA_GOV_CURRENT_BASE_URL);

  if (!responseGeoActivity.ok) {
    throw new Error('Weather data fetch failed');
  }

  const geoActivityData: string = await responseGeoActivity.text();

  const geoActivityDataMapped: GeophysicalWeatherData = parseGeophysicalAlert(geoActivityData);

  return geoActivityDataMapped;
}
