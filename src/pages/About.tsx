import React from 'react';
import { Info, Heart, Shield } from 'lucide-react';

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          About Migraine Tracker
        </h1>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Purpose</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Migraine Tracker is designed to help you understand and manage your migraine patterns.
              By tracking symptoms, triggers, and environmental factors, you can better predict and
              prevent migraine episodes.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Features</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Track migraine symptoms and intensity</li>
              <li>Monitor medication usage and effectiveness</li>
              <li>Analyze weather and environmental triggers</li>
              <li>View biorhythm patterns and correlations</li>
              <li>Generate detailed reports and insights</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Privacy</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your health data is important and private. We use industry-standard encryption and
              security measures to protect your information. Your data is never shared without your
              explicit consent.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
