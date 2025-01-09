import React from 'react';
import { useListsContext } from './../../context/ListsContext';

interface MedicationFormProps {
  onSubmit: () => void;
}

export default function MedicationForm({ onSubmit }: MedicationFormProps) {
  const { medicationList } = useListsContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
      <label
          htmlFor="medication"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Medication Name
        </label>
        <select
          id="medication"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          defaultValue=""
        >
          <option value="" disabled>
            Select a medication
          </option>
          {medicationList.map((medication, index) => (
            <option key={index} value={medication}>
              {medication}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="dosage"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Dosage
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            id="dosage"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          />
          <select className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm">
            <option value="mg">mg</option>
            <option value="ml">ml</option>
            <option value="g">g</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Time Taken
        </label>
        <input
          type="datetime-local"
          id="time"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}
