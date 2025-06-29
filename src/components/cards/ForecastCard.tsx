import React from 'react';
import { IForecast } from '../../models/profileData.types.ts';
import ForecastChart from '../charts/ForecastChart.tsx';

interface IForecastCardProps {
  forecast: IForecast[] | [];
  className?: string;
}

export default function ForecastCard({ forecast, className }: IForecastCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;
  return (
    <>
      <h2 className="text-lg font-semibold dark:text-white">Forecast charts</h2> <br />
      <div className={classNameJoined} style={{ width: '100%', height: 'auto' }}>
        <ForecastChart forecast={forecast} />
      </div>
    </>
  );
}
