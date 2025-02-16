import React, { useState } from 'react';
import { User, Calendar, MapPin, Settings, EarthLock, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase.ts';
import Modal from './../components/Modal';
import AddButton from './../components/AddButton';
import { useProfileDataContext } from '../context/ProfileDataContext';
import SecuritySetupForm from '../components/forms/SecuritySetupForm';
import { UserUpdateDAO } from '../models/user.types';

interface Location {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export default function Profile() {
  const { profileSecurityData } = useProfileDataContext();
  const { theme, toggleTheme } = useTheme();
  const { user, profileSettingsData, setProfileSettingsData } = useAuth();
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
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: '',
  });

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
        setProfileSettingsData({
          ...formData,
          profileFilled: true,
          fetchDataErrors: {
            magneticWeather: '',
            forecast: '',
          },
        });
        console.info('data update');
      }
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: '',
          });
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        error => {
          let codeError: string = 'An unknown error occurred.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for Geolocation.');
              codeError = 'User denied the request for Geolocation.';
              // Display a message to the user explaining why you need their location
              // and how to enable it in their browser settings.
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              codeError = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              codeError = 'The request to get user location timed out.';
              break;
            default:
              console.error('An unknown error occurred.');
              break;
          }

          setLocation({
            latitude: null,
            longitude: null,
            error: `${error.message}. ${codeError}`,
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser.',
      });
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
                <div className="container mx-auto flex justify-between items-center">
                  <button
                    onClick={getLocation}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Get My Location
                  </button>
                  {location.latitude && (
                    <p>
                      Latitude: {location.latitude}, Longitude: {location.longitude}
                    </p>
                  )}
                  {location.error !== '' && (
                    <div
                      id="location-error-message"
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline">{location.error}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {!profileSecurityData?.isInit &&
                  (profileSecurityData.salt || profileSecurityData.key) && (
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
                  <label className="flex items-center gap-3 hidden">
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
                  <label className="flex items-center gap-3 hidden">
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
                  <label className="flex items-center gap-3 hidden">
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
                aggrementSaveSalt &&
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
                      id="securitySetup"
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
