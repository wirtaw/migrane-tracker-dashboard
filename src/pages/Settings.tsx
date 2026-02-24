import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import MedicationManageForm from './../components/forms/MedicationManageForm';
import SymptomTypeManageForm from '../components/forms/SymptomTypeManageForm';
import Modal from './../components/Modal';
import AddButton from './../components/AddButton';
import TriggerTypeManageForm from '../components/forms/TriggerTypeManageForm';
import LocationManageForm from '../components/forms/LocationManageForm';
import ManageDailyMedicationsForm from '../components/forms/ManageDailyMedicationsForm';
import IncidentTypeManageForm from '../components/forms/IncidentTypeManageForm';
import { useWeatherSettings } from '../hooks/useWeatherSettings';

export default function Settings() {
  const { settings, toggleSetting, updateSetting } = useWeatherSettings();
  const [activeModal, setActiveModal] = useState<
    'symptom' | 'medication' | 'incidentTypes' | 'trigger' | 'location' | 'dailyMedication' | null
  >(null);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
          </div>

          <div className="text-center mb-12">
            <section className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  Configure your application settings here.
                </p>
              </div>
            </section>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Medications
              </h2>
              <div className="flex flex-col gap-3 w-full">
                <AddButton
                  id="manageMedication"
                  label="Manage Medications"
                  onClick={() => setActiveModal('medication')}
                />
                <button
                  onClick={() => setActiveModal('dailyMedication')}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
                >
                  Daily Presets
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Symptoms
              </h2>
              <AddButton
                id="manageSyptomsTypes"
                label="Manage Symptoms"
                onClick={() => setActiveModal('symptom')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Incidents Types
              </h2>
              <AddButton
                id="manageIncidentsTypes"
                label="Manage Types"
                onClick={() => setActiveModal('incidentTypes')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Potential Triggers
              </h2>
              <AddButton
                id="managePotentialTriggers"
                label="Manage Triggers"
                onClick={() => setActiveModal('trigger')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Locations
              </h2>
              <AddButton
                id="manageLocations"
                label="Manage Locations"
                onClick={() => setActiveModal('location')}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Weather Display Preferences
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Customize which weather data points appear on your dashboard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={settings.showTemperature}
                onChange={() => toggleSetting('showTemperature')}
                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">Temperature</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={settings.showHumidity}
                onChange={() => toggleSetting('showHumidity')}
                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">Humidity</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={settings.showPressure}
                onChange={() => toggleSetting('showPressure')}
                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Pressure <span className="text-xs text-gray-500 ml-1">(Migraine Trigger)</span>
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={settings.showCloudCover}
                onChange={() => toggleSetting('showCloudCover')}
                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">Cloud Cover</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={settings.showUVIndex}
                onChange={() => toggleSetting('showUVIndex')}
                className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                UV Index <span className="text-xs text-gray-500 ml-1">(Migraine Trigger)</span>
              </span>
            </label>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Forecast Duration
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[24, 48, 72].map(duration => (
                <button
                  key={duration}
                  onClick={() => updateSetting('forecastDuration', duration as 24 | 48 | 72)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    settings.forecastDuration === duration
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {duration} Hours
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Modal
        isOpen={activeModal === 'medication'}
        onClose={() => setActiveModal(null)}
        title="Manage Medication"
      >
        <MedicationManageForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'dailyMedication'}
        onClose={() => setActiveModal(null)}
        title="Manage Daily Medications"
      >
        <ManageDailyMedicationsForm />
      </Modal>
      <Modal
        isOpen={activeModal === 'symptom'}
        onClose={() => setActiveModal(null)}
        title="Manage Symptoms"
      >
        <SymptomTypeManageForm />
      </Modal>

      <Modal
        isOpen={activeModal === 'trigger'}
        onClose={() => setActiveModal(null)}
        title="Manage Triggers"
      >
        <TriggerTypeManageForm />
      </Modal>
      <Modal
        isOpen={activeModal === 'location'}
        onClose={() => setActiveModal(null)}
        title="Manage Locations"
      >
        <LocationManageForm onSubmit={() => setActiveModal(null)} />
      </Modal>
      <Modal
        isOpen={activeModal === 'incidentTypes'}
        onClose={() => setActiveModal(null)}
        title="Manage Incident Types"
      >
        <IncidentTypeManageForm />
      </Modal>
    </>
  );
}
