import React from 'react';
import { Clock } from 'lucide-react';

interface LifeMetricsProps {
  birthDate: Date;
}

export default function LifeMetrics({ birthDate }: LifeMetricsProps) {
  if (!birthDate || typeof birthDate !== 'object' || birthDate.toString() === 'Invalid Date') {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold dark:text-white">Life Metrics</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="font-semibold dark:text-white"> No provided birthdate </div>
        </div>
      </div>
    );
  }

  const calculateMetrics = () => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birthDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365.25);
    const months = Math.floor((days % 365.25) / 30.44);
    const remainingDays = Math.floor(days % 30.44);
    const hours = Math.floor(diffTime / (1000 * 60 * 60));

    return { days, years, months, remainingDays, hours };
  };

  const metrics = calculateMetrics();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold dark:text-white">Life Metrics</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {metrics.days.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Days Lived</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/50 dark:to-red-900/50 rounded-lg">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {metrics.hours.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Hours Lived</div>
        </div>

        <div className="col-span-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-lg">
          <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            {metrics.years} years, {metrics.months} months, {metrics.remainingDays} days
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Age Breakdown</div>
        </div>
      </div>
    </div>
  );
}
