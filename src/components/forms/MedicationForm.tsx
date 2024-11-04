import React from 'react';

interface MedicationFormProps {
  onSubmit: () => void;
}

export default function MedicationForm({ onSubmit }: MedicationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="medication" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Medication Name
        </label>
        <input
          type="text"
          id="medication"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Dosage
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            id="dosage"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <select
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option>mg</option>
            <option>ml</option>
            <option>g</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Taken
        </label>
        <input
          type="datetime-local"
          id="time"
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