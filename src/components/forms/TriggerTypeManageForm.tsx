import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useProfileDataContext } from '../../context/ProfileDataContext';

export default function TriggerTypeManageForm() {
  const { triggerEnumList, setTriggerEnumList } = useProfileDataContext();
  const [newType, setNewType] = useState('');

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newType.trim()) {
      if (!triggerEnumList.includes(newType.trim())) {
        setTriggerEnumList([...triggerEnumList, newType.trim()]);
        setNewType('');
      }
    }
  };

  const handleRemoveType = (typeToRemove: string) => {
    setTriggerEnumList(triggerEnumList.filter(type => type !== typeToRemove));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddType} className="flex gap-2">
        <input
          type="text"
          value={newType}
          onChange={e => setNewType(e.target.value)}
          placeholder="Add new trigger type..."
          className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm px-4 py-2"
        />
        <button
          type="submit"
          disabled={!newType.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Types</h3>
        <div className="flex flex-wrap gap-2">
          {triggerEnumList.map(type => (
            <div
              key={type}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {type}
              <button
                onClick={() => handleRemoveType(type)}
                className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                aria-label={`Remove ${type}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
