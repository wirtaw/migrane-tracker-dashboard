import React, { useState } from 'react';
import BiorhythmChart from './components/BiorhythmChart';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import LifeMetrics from './components/LifeMetrics';
import WeatherWidget from './components/WeatherWidget';
import GeoMagneticWidget from './components/GeoMagneticWidget';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [birthDate] = useState(new Date('1985-05-09'));

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CalendarView />
            </div>
            <div>
              <WeatherWidget />
              <GeoMagneticWidget />
            </div>
            <div>
              <BiorhythmChart birthDate={birthDate} />
            </div>
            <div>
              <LifeMetrics birthDate={birthDate} />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;