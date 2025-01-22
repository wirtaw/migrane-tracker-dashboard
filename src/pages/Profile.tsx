import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Settings, EarthLock, Shield } from 'lucide-react';
import { env } from '../config/env';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase.ts';
import Modal from './../components/Modal';
import AddButton from './../components/AddButton';
import { useProfileDataContext } from '../context/ProfileDataContext';
import SecuritySetupForm from '../components/forms/SecuritySetupForm';
import { UserUpdateDAO } from '../models/user.types';

export default function Profile() {
  const {
    profileSettingsData,
    setProfileSettingsData,
    profileSecurityData,
    setProfileSecurityData,
  } = useProfileDataContext();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ...profileSettingsData,
    salt: profileSecurityData.salt,
    key: profileSecurityData.key,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [aggrementSaveSalt, setAggrementSaveSalt] = useState(false);
  const [aggrementSaveKey, setAggrementSaveKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeModal, setActiveModal] = useState<'securitySetup' | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (supabase && user?.id) {
        const { data, error } = await supabase
          .from('migrane_tracker-users')
          .select('birthdate, latitude, longitude, salt, key, isSecurityFinished')
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
          setProfileSettingsData({
            ...profileSettingsData,
            securitySetup: data.isSecurityFinished,
          });
          setProfileSecurityData({
            ...profileSecurityData,
            isInit: data.isSecurityFinished || false,
            salt: data.salt || '',
            key: data.key || '',
          });
        }
      }
    }

    fetchUserData();
  }, [
    user?.id,
    profileSettingsData,
    setProfileSettingsData,
    profileSecurityData,
    setProfileSecurityData,
  ]);

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
    setProfileSettingsData(formData);

    try {
      if (supabase && user?.id) {
        const payload: UserUpdateDAO = {
          birthdate: formData.birthDate,
          latitude: formData.latitude,
          longitude: formData.longitude,
          salt: null,
          key: null,
          isSecurityFinished: null,
        };

        if (aggrementSaveSalt) {
          payload.salt = profileSecurityData.salt;
        }

        if (aggrementSaveKey) {
          payload.key = profileSecurityData.key;
        }

        if (profileSettingsData.securitySetup) {
          payload.isSecurityFinished = true;
        }

        const { data, error } = await supabase
          .from('migrane_tracker-users')
          .update(payload)
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
    <>
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
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Location
                  </h2>
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
                {!profileSecurityData?.isInit && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Security
                    </h2>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {!profileSecurityData?.isInit && profileSecurityData.salt && (
                    <div>
                      <label
                        htmlFor="salt"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Salt
                      </label>
                      <input
                        type="text"
                        id="salt"
                        name="salt"
                        value={profileSecurityData.salt}
                        readOnly
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                        autoComplete="off"
                      />
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="aggrementSaveSalt"
                          checked={aggrementSaveSalt}
                          onChange={() => setAggrementSaveSalt(!aggrementSaveSalt)}
                          className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          I agree to save the salt
                        </span>
                      </label>
                    </div>
                  )}
                  {!profileSecurityData?.isInit && profileSecurityData.key && (
                    <div>
                      <label
                        htmlFor="key"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Key
                      </label>
                      <input
                        type="text"
                        id="key"
                        name="key"
                        value={profileSecurityData.key}
                        readOnly
                        className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                        autoComplete="off"
                      />
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="aggrementSaveKey"
                          checked={aggrementSaveKey}
                          onChange={() => setAggrementSaveKey(!aggrementSaveKey)}
                          className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          I agree to save the key
                        </span>
                      </label>
                    </div>
                  )}
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
                      name="personalHealthData"
                      checked={formData.personalHealthData}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Enable personal health data storage
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

              {!profileSettingsData?.securitySetup &&
                (!profileSecurityData.salt || !profileSecurityData.key) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <EarthLock className="w-5 h-5 text-indigo-500" />
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Security
                      </h2>
                    </div>
                    <AddButton
                      label="Setup Security"
                      onClick={() => setActiveModal('securitySetup')}
                    />
                  </div>
                )}
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
      <Modal
        isOpen={activeModal === 'securitySetup'}
        onClose={() => setActiveModal(null)}
        title="Setup Security"
      >
        <SecuritySetupForm onSubmit={() => setActiveModal(null)} />
      </Modal>
    </>
  );
}
