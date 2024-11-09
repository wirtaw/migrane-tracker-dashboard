import React from 'react';
import { Scale } from 'lucide-react';

export default function Legal() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Information</h1>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Terms of Service
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                By using Migraine Tracker, you agree to these terms. The service is provided "as is"
                without warranty of any kind. We reserve the right to modify or discontinue the
                service at any time.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Disclaimer</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                Migraine Tracker is not a medical device and should not be used for medical
                diagnosis. Always consult with healthcare professionals for medical advice. We are
                not responsible for any decisions made based on the data tracked in this
                application.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Intellectual Property
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                All content, features, and functionality of Migraine Tracker are owned by us and are
                protected by international copyright, trademark, and other intellectual property
                laws.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Contact Information
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                For any legal inquiries or concerns, please contact our legal department at:
                legal@migrainetracker.example.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
