import React from 'react';

interface DownloadDataFormProps {
  onSubmit: () => void;
  decode: boolean;
}

export default function DownloadDataForm({ onSubmit, decode }: DownloadDataFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="download"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Download JSON file
        </label>
        <div className="text-gray-900 dark:text-white">{decode.toString()}</div>
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
