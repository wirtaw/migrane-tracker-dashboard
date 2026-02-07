import { useState } from 'react';
import BiorhythmChart from '../components/BiorhythmChart';
import CalendarView from '../components/CalendarView';
import LifeMetrics from '../components/LifeMetrics';
import WeatherWidget from '../components/WeatherWidget';
import GeoMagneticWidget from '../components/GeoMagneticWidget';
import TrackingButtons from '../components/TrackingButtons';
import MostRecentData from '../components/MostRecentData';
import MigrainePreventionTip from '../components/MigrainePreventionTip';
import EveryDayMedicationWidget from '../components/widgets/EveryDayMedicationWidget';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { currentMonth } = useProfileDataContext();
  const { profileSettingsData } = useAuth();
  const [birthDate] = useState(new Date(profileSettingsData.birthDate));

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <CalendarView weekDays={weekDays} firstDayOfMonth={firstDayOfMonth} days={days} />

          <TrackingButtons />

          <GeoMagneticWidget />

          <MostRecentData />

          <BiorhythmChart birthDate={birthDate} />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <WeatherWidget />

          <EveryDayMedicationWidget />

          <MigrainePreventionTip />

          <LifeMetrics birthDate={birthDate} />
        </div>
      </div>
    </main>
  );
}
