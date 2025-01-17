import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { Weight } from '../../models/profileData.types';
import { getIsoDate } from '../../lib/utils.ts';

interface WeightFormProps {
  onSubmit: () => void;
}

export default function WeightForm({ onSubmit }: WeightFormProps) {
  const { weightList, setWeightList } = useProfileDataContext();

  const [selectedWeight, setSelectedWeight] = useState<Weight[]>([...weightList]);
  const [newWeight, setNewWeight] = useState('');
  const [weightDatetime, setWeightDatetime] = useState(getIsoDate(new Date()));

  const handleAddNewItem = () => {
    const item: Weight = {
      id: Math.max(...weightList.map(item => item.id)) + 1,
      userId: '1',
      weight: parseFloat(newWeight),
      notes: '',
      datetimeAt: new Date(weightDatetime),
    };
    setSelectedWeight([...selectedWeight, item]);
    setWeightList([...selectedWeight, item]);
  };

  const handleItemClick = (id: number) => {
    setSelectedWeight(selectedWeight.filter(item => item.id !== id));
    setWeightList(selectedWeight.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
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
          value={weightDatetime}
          onChange={e => setWeightDatetime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="newWeight"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add New Weight
        </label>
        <input
          type="text"
          id="newWeight"
          value={newWeight}
          onChange={e => setNewWeight(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAddNewItem}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Weight
        </button>
      </div>
      <div>
        <label
          htmlFor="medicationList"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Weights
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedWeight.map(({ id, weight, datetimeAt }, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(id)}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {weight} {getIsoDate(datetimeAt)}
            </button>
          ))}
        </div>
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
