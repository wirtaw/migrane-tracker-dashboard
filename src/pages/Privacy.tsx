import React from 'react';
import { Shield, Lock, UserX, Database } from 'lucide-react';

export default function Privacy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Data Collection
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                We collect and store only the information you explicitly provide through the
                application:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                <li>Migraine symptoms and triggers</li>
                <li>Medication tracking data</li>
                <li>Personal health information you choose to record</li>
                <li>Basic profile information</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Data Security
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                Your data is encrypted and stored securely. We implement industry-standard security
                measures to protect your information from unauthorized access, disclosure,
                alteration, and destruction.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                No Data Sharing
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">We do not:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                <li>Sell your personal information to third parties</li>
                <li>Use your data for advertising purposes</li>
                <li>Share your information for research purposes</li>
                <li>Process your data for any purpose other than providing our service</li>
              </ul>
            </div>
          </section>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Your Consent
            </h3>
            <p className="text-blue-700 dark:text-blue-200">
              By using Migraine Tracker, you consent to the collection and use of your information
              as described in this Privacy Policy. You can request deletion of your data at any time
              through your account settings.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
