import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import BiorhythmChart from '../components/BiorhythmChart';
import CalendarView from '../components/CalendarView';
import LifeMetrics from '../components/LifeMetrics';
import WeatherWidget from '../components/WeatherWidget';
import GeoMagneticWidget from '../components/GeoMagneticWidget';
import TrackingButtons from '../components/TrackingButtons';
import MostRecentData from '../components/MostRecentData';
import { useProfileDataContext } from '../context/ProfileDataContext';

export default function Dashboard() {
  const { currentMonth, profileSettingsData } = useProfileDataContext();
  const [birthDate] = useState(new Date(profileSettingsData.birthDate));

  if (
    birthDate.toString() === 'Invalid Date' ||
    !profileSettingsData.latitude ||
    !profileSettingsData.longitude
  ) {
    return <Navigate to="/profile" replace />;
  }

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView weekDays={weekDays} firstDayOfMonth={firstDayOfMonth} days={days} />
        </div>
        <div>
          <WeatherWidget />
        </div>
        <div>
          <GeoMagneticWidget />
        </div>
        <div>
          <MostRecentData />
        </div>
        <div>
          <TrackingButtons />
        </div>
        <div>
          <BiorhythmChart birthDate={birthDate} />
        </div>
        <div>
          <LifeMetrics birthDate={birthDate} />
        </div>
      </div>
    </main>
  );
}
