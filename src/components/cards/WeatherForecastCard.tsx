import { IDailyForecast } from '../../services/weather';
import { DateTime } from 'luxon';

interface Props {
  data: IDailyForecast;
}

export default function WeatherForecastCard({ data }: Props) {
  return (
    <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="font-semibold text-slate-700 dark:text-slate-200">
        {DateTime.fromMillis(data.date.getTime()).toFormat('EEEE')}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        {DateTime.fromMillis(data.date.getTime()).toFormat('MMM d')}
      </div>

      <div className="flex items-center space-x-2 my-2">
        {/* You can map weatherCode to icons here */}
        <span className="text-2xl">⛅</span>
      </div>

      <div className="flex space-x-3 text-sm">
        <span className="font-bold text-slate-800 dark:text-white">
          {Math.round(data.temperatureMax)}°
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {Math.round(data.temperatureMin)}°
        </span>
      </div>
    </div>
  );
}
