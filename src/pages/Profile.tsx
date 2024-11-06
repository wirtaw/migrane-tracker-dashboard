import React from 'react';
import { User, Calendar, MapPin, Settings } from 'lucide-react';

export default function Profile() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-8 space-y-8">
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
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                defaultValue="1990-01-01"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Location</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Latitude"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Preferences
                </h2>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Enable email notifications
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
                  <span className="text-gray-700 dark:text-gray-300">Daily summary reports</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
