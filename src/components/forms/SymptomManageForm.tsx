import React, { useState } from 'react';
import { useListsContext } from '../../context/ListsContext';

interface SymptomManageFormProps {
  onSubmit: () => void;
}

export default function SymptomManageForm({ onSubmit }: SymptomManageFormProps) {
  const { symptomList, setSymptomList } = useListsContext();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([...symptomList]);
  const [newSymptom, setNewSymptom] = useState('');

  const handleItemClick = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      setSymptomList([...selectedSymptoms, symptom]);
    }
  };

  const handleRemoveItem = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(item => item !== symptom));
    setSymptomList([...selectedSymptoms.filter(item => item !== symptom)]);
  };

  const handleAddNewItem = () => {
    if (newSymptom && !symptomList.includes(newSymptom)) {
      setSymptomList([...symptomList, newSymptom]);
      setSelectedSymptoms([...selectedSymptoms, newSymptom]);
      setNewSymptom('');
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
          htmlFor="newSymptom"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add New Symptom
        </label>
        <input
          type="text"
          id="newSymptom"
          value={newSymptom}
          onChange={e => setNewSymptom(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAddNewItem}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Symptom
        </button>
      </div>

      <div>
        <label
          htmlFor="symptomList"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Symptoms
        </label>
        <input
          type="text"
          id="symptomList"
          value={selectedSymptoms.join(', ')}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {symptomList.map((symptom, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(symptom)}
              disabled={selectedSymptoms.includes(symptom)}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium ${
                selectedSymptoms.includes(symptom)
                  ? 'text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedSymptoms.map((symptom, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleRemoveItem(symptom)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 rounded-full text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {symptom} &times;
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
