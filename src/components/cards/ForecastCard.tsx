import React from 'react';
import { DateTime } from 'luxon';

import { IForecast } from '../../models/profileData.types.ts';

interface IIForecastCardProps {
  forecast: IForecast;
  className?: string;
}

export default function ForecastCard({ forecast, className }: IIForecastCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;
  return (
    <div className={classNameJoined}>
      <div className="space-y-2">
        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200"></h3>
        <p className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200">
          Time - {DateTime.fromISO(forecast.datetime).toISODate()}{' '}
          {DateTime.fromISO(forecast.datetime).toISOTime()} <br />
          Temperature - {forecast.temperature}°C <br />
          Pressure - {forecast.pressure} hPa
          <br />
          Humidity - {forecast.humidity} %<br />
          Wind speed 10m - {forecast.windSpeed} m/s
          <br />
          Clouds - {forecast.clouds} %<br />
          Uvi - {forecast.uvi}
          <br />
        </p>
      </div>
    </div>
  );
}
