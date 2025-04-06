import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { IBloodPressure } from '../../models/profileData.types';
import { getIsoDate } from '../../lib/utils.ts';

interface IBloodPressureFormProps {
  onSubmit: () => void;
}

const BloodPressureForm: React.FC<IBloodPressureFormProps> = ({ onSubmit }) => {
  const { bloodPressureList, setBloodPressureList } = useProfileDataContext();

  const [selectedBloodPressure, setSelectedBloodPressure] = useState<IBloodPressure[]>([
    ...bloodPressureList,
  ]);
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [dateTime, setDateTime] = useState<string>('');
  const [notes, setNotes] = useState<string | ''>('');

  const handleItemClick = (id: number) => {
    setSelectedBloodPressure(selectedBloodPressure.filter(item => item.id !== id));
    setBloodPressureList(selectedBloodPressure.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="dateTime"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          DateTime
        </label>
        <input
          type="datetime-local"
          id="dateTime"
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
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        ></textarea>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            const item: IBloodPressure = {
              id: Math.max(...bloodPressureList.map(item => item.id)) + 1,
              userId: '1',
              systolic: systolic as number,
              diastolic: diastolic as number,
              notes: notes as string,
              datetimeAt: new Date(dateTime),
            };
            setSelectedBloodPressure([...selectedBloodPressure, item]);
            setBloodPressureList([...selectedBloodPressure, item]);
          }}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Blood Pressure
        </button>
      </div>
      <div>
        <label
          htmlFor="bloodPressureList"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Blood Pressure List
        </label>
        <ul
          id="bloodPressureList"
          className="mt-1 divide-y divide-gray-200 dark:divide-gray-700 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        >
          {bloodPressureList.map(({ id, systolic, diastolic, datetimeAt }: IBloodPressure) => (
            <li key={id} className="flex justify-between">
              <span>
                {systolic}/{diastolic} - {getIsoDate(datetimeAt)}
              </span>
              <button type="button" onClick={() => handleItemClick(id)} className="text-red-500">
                Remove
              </button>
            </li>
          ))}
        </ul>
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
