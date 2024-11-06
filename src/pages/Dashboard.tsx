import React, { useState } from 'react';
import BiorhythmChart from '../components/BiorhythmChart';
import CalendarView from '../components/CalendarView';
import LifeMetrics from '../components/LifeMetrics';
import WeatherWidget from '../components/WeatherWidget';
import GeoMagneticWidget from '../components/GeoMagneticWidget';
import TrackingButtons from '../components/TrackingButtons';
import { env } from '../config/env';

export default function Dashboard() {
  const [birthDate] = useState(new Date(env.BIRTH_DATE));

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView />
        </div>
        <div>
          <WeatherWidget />
        </div>
        <div>
          <GeoMagneticWidget />
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
