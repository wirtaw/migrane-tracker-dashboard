import React, { useState } from 'react';
import BiorhythmChart from './components/BiorhythmChart';
import CalendarView from './components/CalendarView';
import LifeMetrics from './components/LifeMetrics';
import WeatherWidget from './components/WeatherWidget';
import { Brain } from 'lucide-react';

function App() {
  // For demo purposes - in production, this would be user input
  const [birthDate] = useState(new Date('1985-05-09'));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Migraine Tracker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          <div>
            <WeatherWidget />
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
  );
}

export default App;