import React from 'react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-8">
          <h1 className="text-3xl font-medium text-indigo-900 dark:text-indigo-300">
            Your Wellness Guide
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Welcome to your safe space for tracking. Here is a gentle guide on how to get the most
            out of your dashboard.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-100">
              🌱 Getting Started on Your Journey
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The best way to start is simply by observing. Use the <strong>Health Logs</strong> to
              record your daily mood, sleep quality, and water intake. If you experience a migraine,
              log it under <strong>Incidents</strong>. Don't worry about being perfect; even a
              little data helps our engine learn your baseline.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-100">
              📊 Understanding Your Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your dashboard connects the dots between you and the world around you:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Solar & Weather Widgets:</strong> Fluctuations in barometric pressure, UV
                Index, and Geo-Magnetic activity can be hidden triggers. We pull this data
                automatically based on your location.
              </li>
              <li>
                <strong>Biorhythms:</strong> Your body runs on natural cycles. This chart helps
                visualize your physical, emotional, and intellectual energy levels throughout the
                month.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-100">
              🔍 Finding Your Triggers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              As you log your days, our <strong>Prediction Rules</strong> engine will gently notify
              you of upcoming risks. For example, if you frequently log migraines on days with high
              Solar Flux, the app will learn to give you a heads-up when those days approach again.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-xl">
            <h2 className="text-xl font-medium text-indigo-900 dark:text-indigo-300">
              🔐 Your Data, Your Safe Space
            </h2>
            <p className="text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed text-sm">
              We know how sensitive health data is. Your logs, triggers, and personal information
              are strictly encrypted and completely private. This tool is built for your eyes and
              your healing journey only.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
