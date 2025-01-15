import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';

interface TriggerManageFormProps {
  onSubmit: () => void;
}

export default function TriggerManageForm({ onSubmit }: TriggerManageFormProps) {
  const { triggerEnumList, setTriggerEnumList } = useProfileDataContext();
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([...triggerEnumList]);
  const [newTrigger, setNewTrigger] = useState('');

  const handleItemClick = (trigger: string) => {
    if (!selectedTriggers.includes(trigger)) {
      setSelectedTriggers([...selectedTriggers, trigger]);
      setTriggerEnumList([...selectedTriggers, trigger]);
    }
  };

  const handleRemoveItem = (trigger: string) => {
    setSelectedTriggers(selectedTriggers.filter(item => item !== trigger));
    setTriggerEnumList([...selectedTriggers.filter(item => item !== trigger)]);
  };

  const handleAddNewItem = () => {
    if (newTrigger && !triggerEnumList.includes(newTrigger)) {
      setTriggerEnumList([...triggerEnumList, newTrigger]);
      setSelectedTriggers([...selectedTriggers, newTrigger]);
      setNewTrigger('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="newTrigger"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add New Trigger
        </label>
        <input
          type="text"
          id="newTrigger"
          value={newTrigger}
          onChange={e => setNewTrigger(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAddNewItem}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Trigger
        </button>
      </div>

      <div>
        <label
          htmlFor="triggerList"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Triggers
        </label>
        <input
          type="text"
          id="triggerList"
          value={selectedTriggers.join(', ')}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {triggerEnumList.map((trigger, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(trigger)}
              disabled={selectedTriggers.includes(trigger)}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium ${
                selectedTriggers.includes(trigger)
                  ? 'text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {trigger}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedTriggers.map((trigger, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleRemoveItem(trigger)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 rounded-full text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {trigger} &times;
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
