import React from 'react';
import { Scale } from 'lucide-react';

export default function Documentation() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documentation</h1>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Getting Started
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">
                Welcome to the Migraine Tracker documentation. This is a work in progress, so please
                check back often for updates.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
