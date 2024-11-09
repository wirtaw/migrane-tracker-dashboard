import React, { useState } from 'react';
import { User, Calendar, MapPin, Settings } from 'lucide-react';
import { env } from '../config/env';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    birthDate: env.BIRTH_DATE,
    latitude: env.LATITUDE.toString(),
    longitude: env.LONGITUDE.toString(),
    emailNotifications: false,
    dailySummary: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      // Here you would typically save to your backend
      console.log('Saved:', formData);
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
                Manage your account settings and preferences
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
    </main>
  );
}
