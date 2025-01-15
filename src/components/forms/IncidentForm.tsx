import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';

interface IncidentFormProps {
  onSubmit: () => void;
}

export default function IncidentForm({ onSubmit }: IncidentFormProps) {
  const [triggers, setTriggers] = useState<string[]>([]);
  const { incidentEnumList, triggerEnumList } = useProfileDataContext();

  const handleTagClick = (tag: string) => {
    setTriggers([...new Set([...triggers, tag])]);
  };

  const handleClearTriggers = () => {
    setTriggers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Incident Type
        </label>
        <select
          id="type"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          defaultValue=""
        >
          <option value="" disabled>
            Select a type
          </option>
          {incidentEnumList.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="start"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Start Time
        </label>
        <input
          type="datetime-local"
          id="start"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Duration (hours)
        </label>
        <input
          type="number"
          id="duration"
          min="0"
          step="0.5"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="triggers"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Potential Triggers
        </label>
        <input
          type="text"
          id="triggers"
          value={triggers.join(', ')}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {triggerEnumList.map((trigger, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTagClick(trigger)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {trigger}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleClearTriggers}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Clear Triggers
        </button>
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
