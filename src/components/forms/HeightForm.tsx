import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { Height } from '../../models/profileData.types';
import { getIsoDate } from '../../lib/utils.ts';

interface HeightFormProps {
  onSubmit: () => void;
}

export default function HeightForm({ onSubmit }: HeightFormProps) {
  const { heightList, setHeightList } = useProfileDataContext();

  const [selectedHeight, setSelectedHeight] = useState<Height[]>([...heightList]);
  const [newHeight, setNewHeight] = useState('');
  const [heightDatetime, setHeightDatetime] = useState(getIsoDate(new Date()));

  const handleAddNewItem = () => {
    const item: Height = {
      id: Math.max(...heightList.map(item => item.id)) + 1,
      userId: '1',
      height: parseFloat(newHeight),
      notes: '',
      datetimeAt: new Date(heightDatetime),
    };
    setSelectedHeight([...selectedHeight, item]);
    setHeightList([...selectedHeight, item]);
  };

  const handleItemClick = (id: number) => {
    setSelectedHeight(selectedHeight.filter(item => item.id !== id));
    setHeightList(selectedHeight.filter(item => item.id !== id));
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
          value={heightDatetime}
          onChange={e => setHeightDatetime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="newHeight"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add New Height
        </label>
        <input
          type="text"
          id="newHeight"
          value={newHeight}
          onChange={e => setNewHeight(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAddNewItem}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Height
        </button>
      </div>
      <div>
        <label
          htmlFor="heightsList"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Heights
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedHeight.map(({ id, height, datetimeAt }, index) => (
            <li key={id} className="flex justify-between">
              <span>
                {height} / {getIsoDate(datetimeAt)}
              </span>
              <button
                key={index}
                type="button"
                onClick={() => handleItemClick(id)}
                className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Remove
              </button>
            </li>
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
