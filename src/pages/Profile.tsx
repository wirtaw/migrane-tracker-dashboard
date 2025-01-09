import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Settings } from 'lucide-react';
import { env } from '../config/env';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase.ts';
import MedicationForm from './../components/forms/MedicationForm';
import SymptomForm from './../components/forms/SymptomForm';
import IncidentForm from './../components/forms/IncidentForm';
import { useListsContext } from './../context/ListsContext';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    birthDate: env.BIRTH_DATE,
    latitude: env.LATITUDE.toString(),
    longitude: env.LONGITUDE.toString(),
    emailNotifications: false,
    dailySummary: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { medicationList, symptomList, incidentList, triggerList } = useListsContext();
  const [isMedicationModalOpen, setMedicationModalOpen] = useState(false);
  const [isSymptomModalOpen, setSymptomModalOpen] = useState(false);
  const [isIncidentModalOpen, setIncidentModalOpen] = useState(false);
  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false);

  const handleOpenModal = (modalType: string) => {
    switch (modalType) {
      case 'medication':
        setMedicationModalOpen(true);
        break;
      case 'symptom':
        setSymptomModalOpen(true);
        break;
      case 'incident':
        setIncidentModalOpen(true);
        break;
      case 'trigger':
        setTriggerModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModal = (modalType: string) => {
    switch (modalType) {
      case 'medication':
        setMedicationModalOpen(false);
        break;
      case 'symptom':
        setSymptomModalOpen(false);
        break;
      case 'incident':
        setIncidentModalOpen(false);
        break;
      case 'trigger':
        setTriggerModalOpen(false);
        break;
      default:
        break;
    }
  };
  
  useEffect(() => {
    async function fetchUserData() {
      if (supabase && user?.id) {
        const { data, error } = await supabase
          .from('migrane_tracker-users')
          .select('birthdate, latitude, longitude')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data) {
          setFormData(prev => ({
            ...prev,
            birthDate: data.birthdate || env.BIRTH_DATE,
            latitude: data.latitude?.toString() || env.LATITUDE.toString(),
            longitude: data.longitude?.toString() || env.LONGITUDE.toString(),
          }));
        }
      }
    }

    fetchUserData();
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      if (supabase && user?.id) {
        const { data, error } = await supabase
          .from('migrane_tracker-users')
          .update({
            birthdate: formData.birthDate,
            latitude: formData.latitude,
            longitude: formData.longitude,
          })
          .eq('user_id', user.id)
          .select();

        if (error) {
          throw error;
        }
        setSaveStatus('success');
        console.log('Saved:', data);
      }
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your {user?.email} account settings and preferences
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Birth Date
                </h2>
              </div>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                autoComplete="bday"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Location</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                    autoComplete="off"
                    placeholder="e.g., 51.5074"
                  />
                </div>
                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                    autoComplete="off"
                    placeholder="e.g., -0.1278"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Info</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <h2>Medications</h2>
                <ul>
                {medicationList.length && medicationList.map((medication: string, index: number) => (
                  <li key={index}>{medication}</li>
                ))}
              </ul>
                <button onClick={() => handleOpenModal('medication')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >Modify Medications</button>
              </div>

              <div>
                <h2>Symptoms</h2>
                <ul>
                  {symptomList.length && symptomList.map((symptom: string, index: number) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
                <button onClick={() => handleOpenModal('symptom')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >Modify Symptoms</button>
              </div>

              <div>
                <h2>Incidents</h2>
                <ul>
                  {incidentList.length && incidentList.map((incident: string, index: number) => (
                    <li key={index}>{incident}</li>
                  ))}
                </ul>
                <button onClick={() => handleOpenModal('incident')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >Modify Incidents</button>
              </div>

              <div>
                <h2>Potential Triggers</h2>
                <ul>
                  {triggerList.length && triggerList.map((trigger: string, index: number) => (
                    <li key={index}>{trigger}</li>
                  ))}
                </ul>
                <button onClick={() => handleOpenModal('trigger')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >Modify Triggers</button>
              </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Preferences
                </h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Enable email notifications
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="dailySummary"
                    checked={formData.dailySummary}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Daily summary reports</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Dark mode</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            {saveStatus === 'success' && (
              <span className="text-green-600 dark:text-green-400">
                Settings saved successfully!
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-600 dark:text-red-400">Failed to save settings</span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
                isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
        </div>
        {isMedicationModalOpen && (
          <div className="modal">
            <MedicationForm onSubmit={() => handleCloseModal('medication')} />
          </div>
        )}

        {isSymptomModalOpen && (
          <div className="modal">
            <SymptomForm onSubmit={() => handleCloseModal('symptom')} />
          </div>
        )}

        {isIncidentModalOpen && (
          <div className="modal">
            <IncidentForm onSubmit={() => handleCloseModal('incident')} />
          </div>
        )}
    </main>
  );
}