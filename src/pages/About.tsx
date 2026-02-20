import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-light text-indigo-900 dark:text-indigo-300 tracking-tight">
            You are more than your migraines.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Living with chronic migraines can feel unpredictable and overwhelming. 
            We built this tracker to help you find your patterns and reclaim your peace of mind. 
            By gently observing your daily habits, the weather outside, and even solar activity, 
            we aim to give you back a sense of control.
          </p>
        </div>

        {/* Core Pillars Section */}
        <div className="grid md:grid-cols-3 gap-8 pt-8">
          {/* Pillar 1 */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center space-y-4">
            <div className="text-4xl">🧘‍♀️</div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">Listen to Your Body</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Log your symptoms, daily habits, and medication routines without judgment. 
              Every day you track is a step toward understanding your unique body.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center space-y-4">
            <div className="text-4xl">🌤️</div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">Understand Your Environment</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Sometimes, the triggers are outside of our control. We seamlessly track 
              weather shifts, barometric pressure, and solar activity so you don't have to.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center space-y-4">
            <div className="text-4xl">✨</div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">Discover Your Patterns</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Our gentle prediction engine works in the background, analyzing your data 
              to provide early forecasts, helping you prepare for the days ahead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
