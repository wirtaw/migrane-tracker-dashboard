import React from 'react';

interface IncidentFormProps {
  onSubmit: () => void;
}

export default function IncidentForm({ onSubmit }: IncidentFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Incident Type
        </label>
        <select
          id="type"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option>Migraine Attack</option>
          <option>Aura Episode</option>
          <option>Tension Headache</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="start" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Time
        </label>
        <input
          type="datetime-local"
          id="start"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Duration (hours)
        </label>
        <input
          type="number"
          id="duration"
          min="0"
          step="0.5"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="triggers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Potential Triggers
        </label>
        <input
          type="text"
          id="triggers"
          placeholder="e.g., stress, lack of sleep, food"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}