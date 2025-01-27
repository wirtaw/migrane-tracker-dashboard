import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, LineChart, FileText, FolderKanban, Settings } from 'lucide-react';

export default function Main() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Migraine Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Track, analyze, and understand your migraine patterns
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            icon: <Activity className="w-8 h-8 text-indigo-500" />,
            title: 'Track Symptoms',
            description: 'Log your migraine symptoms and intensity',
            link: {
              title: 'Go to Dashboard',
              path: '/dashboard',
            },
          },
          {
            icon: <Calendar className="w-8 h-8 text-pink-500" />,
            title: 'Daily Monitoring',
            description: 'Keep a detailed diary of your episodes',
          },
          {
            icon: <LineChart className="w-8 h-8 text-blue-500" />,
            title: 'Analyze Patterns',
            description: 'Identify triggers and patterns over time',
          },
          {
            icon: <LineChart className="w-8 h-8 text-blue-500" />,
            title: 'Report',
            description: 'Historical data report',
            link: {
              title: 'View',
              path: '/report-page',
            },
          },
          {
            icon: <FileText className="w-8 h-8 text-grey-800" />,
            title: 'Documentation & Guides',
            description: 'Description of the application and how to use it',
            link: {
              title: 'Get Started',
              path: '/docs',
            },
          },
          {
            icon: <FolderKanban className="w-8 h-8 text-green-500" />,
            title: 'Data Management',
            description: 'Import and manage your data',
            link: {
              title: 'Get Started',
              path: '/data-management',
            },
          },
          {
            icon: <Settings className="w-8 h-8 text-yellow-800" />,
            title: 'Settings',
            description: 'Configure your application settings',
            link: {
              title: 'Manage Settings',
              path: '/settings',
            },
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
              {feature?.link && feature.link?.path && (
                <Link
                  to={feature.link.path}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {feature.link.title}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
          <Activity className="w-5 h-5" />
        </Link>
      </div>
    </main>
  );
}
