import React from 'react';
import { Activity, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface BiorhythmProps {
  birthDate: Date;
  targetDate?: Date;
}

interface BiorhythmValue {
  current: number;
  next: number;
  cycle: number;
  name: string;
  color: string;
}

const calculateBiorhythm = (birthDate: Date, targetDate: Date = new Date(), days: number): number => {
  const t = Math.floor((targetDate.getTime() - birthDate.getTime()) / (24 * 60 * 60 * 1000));
  return Math.sin((2 * Math.PI * t) / days);
};

const getPercentage = (value: number): number => Math.round((value + 1) * 50);

const getTrendIcon = (current: number, next: number) => {
  const diff = next - current;
  if (Math.abs(diff) < 0.05) return <Minus className="w-4 h-4 text-gray-400" />;
  return diff > 0 ? 
    <TrendingUp className="w-4 h-4 text-green-500" /> : 
    <TrendingDown className="w-4 h-4 text-red-500" />;
};

const getDeltaText = (current: number, next: number): string => {
  const diff = getPercentage(next) - getPercentage(current);
  if (Math.abs(diff) < 2) return 'Stable';
  return `${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`;
};

export default function BiorhythmChart({ birthDate, targetDate = new Date() }: BiorhythmProps) {
  if (!birthDate) {
    return '';
  }
  
  const tomorrow = new Date(targetDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const biorhythms: BiorhythmValue[] = [
    {
      name: 'Physical',
      cycle: 23,
      current: calculateBiorhythm(birthDate, targetDate, 23),
      next: calculateBiorhythm(birthDate, tomorrow, 23),
      color: 'bg-blue-500'
    },
    {
      name: 'Emotional',
      cycle: 28,
      current: calculateBiorhythm(birthDate, targetDate, 28),
      next: calculateBiorhythm(birthDate, tomorrow, 28),
      color: 'bg-pink-500'
    },
    {
      name: 'Intellectual',
      cycle: 33,
      current: calculateBiorhythm(birthDate, targetDate, 33),
      next: calculateBiorhythm(birthDate, tomorrow, 33),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold dark:text-white">Biorhythm Analysis</h2>
      </div>
      
      <div className="space-y-6">
        {biorhythms.map((rhythm) => (
          <div key={rhythm.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {rhythm.name} ({rhythm.cycle} days)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium dark:text-gray-300">
                  {getPercentage(rhythm.current)}%
                </span>
                <div className="flex items-center gap-1 min-w-[60px]">
                  {getTrendIcon(rhythm.current, rhythm.next)}
                  <span className="text-xs font-medium dark:text-gray-400">
                    {getDeltaText(rhythm.current, rhythm.next)}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${rhythm.color} transition-all duration-300`}
                style={{ width: `${getPercentage(rhythm.current)}%` }}
              />
              <div 
                className={`absolute top-0 h-full w-1 bg-white dark:bg-gray-900 transform -translate-x-1/2 opacity-50`}
                style={{ left: `${getPercentage(rhythm.next)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}