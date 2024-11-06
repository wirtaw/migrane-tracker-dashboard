import React from 'react';

interface SymptomFormProps {
  onSubmit: () => void;
}

export default function SymptomForm({ onSubmit }: SymptomFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="symptom"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Symptom Type
        </label>
        <select
          id="symptom"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option>Headache</option>
          <option>Nausea</option>
          <option>Aura</option>
          <option>Sensitivity to Light</option>
          <option>Sensitivity to Sound</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="severity"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Severity (1-10)
        </label>
        <input
          type="number"
          id="severity"
          min="1"
          max="10"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
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
