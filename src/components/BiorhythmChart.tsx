import React from 'react';
import { Activity } from 'lucide-react';

interface BiorhythmProps {
  birthDate: Date;
  targetDate?: Date;
}

const calculateBiorhythm = (birthDate: Date, targetDate: Date = new Date(), days: number): number => {
  const t = Math.floor((targetDate.getTime() - birthDate.getTime()) / (24 * 60 * 60 * 1000));
  return Math.sin((2 * Math.PI * t) / days);
};

export default function BiorhythmChart({ birthDate, targetDate = new Date() }: BiorhythmProps) {
  const physical = calculateBiorhythm(birthDate, targetDate, 23);
  const emotional = calculateBiorhythm(birthDate, targetDate, 28);
  const intellectual = calculateBiorhythm(birthDate, targetDate, 33);

  const getPercentage = (value: number): number => ((value + 1) * 50);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold dark:text-white">Biorhythm Analysis</h2>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm dark:text-gray-300">
            <span>Physical (23 days)</span>
            <span>{Math.round(getPercentage(physical))}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${getPercentage(physical)}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm dark:text-gray-300">
            <span>Emotional (28 days)</span>
            <span>{Math.round(getPercentage(emotional))}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-500 transition-all duration-300"
              style={{ width: `${getPercentage(emotional)}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm dark:text-gray-300">
            <span>Intellectual (33 days)</span>
            <span>{Math.round(getPercentage(intellectual))}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${getPercentage(intellectual)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}