import React, { useState } from 'react';

interface BloodPressureFormProps {
  onSubmit: (systolic: number, diastolic: number) => void;
}

const BloodPressureForm: React.FC<BloodPressureFormProps> = ({ onSubmit }) => {
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [dateTime, setDateTime] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (systolic !== '' && diastolic !== '') {
      onSubmit(systolic, diastolic);
      setSystolic('');
      setDiastolic('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="start"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          DateTime
        </label>
        <input
          type="date-local"
          id="start"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="systolic">Systolic:</label>
        <input
          type="number"
          id="systolic"
          value={systolic}
          onChange={e => setSystolic(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="diastolic">Diastolic:</label>
        <input
          type="number"
          id="diastolic"
          value={diastolic}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          onChange={e => setDiastolic(Number(e.target.value))}
          required
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
};

export default BloodPressureForm;
