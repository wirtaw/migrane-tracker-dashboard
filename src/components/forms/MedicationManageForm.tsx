import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';

interface MedicationManageFormProps {
  onSubmit: () => void;
}

export default function MedicationManageForm({ onSubmit }: MedicationManageFormProps) {
  const { medicationEnumList, setMedicationEnumList } = useProfileDataContext();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([...medicationEnumList]);
  const [newMedication, setNewMedication] = useState('');

  const handleItemClick = (medication: string) => {
    if (!selectedMedications.includes(medication)) {
      setSelectedMedications([...selectedMedications, medication]);
      setMedicationEnumList([...selectedMedications, medication]);
    }
  };

  const handleRemoveItem = (medication: string) => {
    setSelectedMedications(selectedMedications.filter(item => item !== medication));
    setMedicationEnumList([...selectedMedications.filter(item => item !== medication)]);
  };

  const handleAddNewItem = () => {
    if (newMedication && !medicationEnumList.includes(newMedication)) {
      setMedicationEnumList([...medicationEnumList, newMedication]);
      setSelectedMedications([...selectedMedications, newMedication]);
      setNewMedication('');
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
          htmlFor="newMedication"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add New Medication
        </label>
        <input
          type="text"
          id="newMedication"
          value={newMedication}
          onChange={e => setNewMedication(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAddNewItem}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Medication
        </button>
      </div>
      <div>
        <label
          htmlFor="medicationList"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Medications
        </label>
        <input
          type="text"
          id="medications"
          value={selectedMedications.join(', ')}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {medicationEnumList.map((medication, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(medication)}
              disabled={selectedMedications.includes(medication)}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium ${
                selectedMedications.includes(medication)
                  ? 'text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {medication}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedMedications.map((medication, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleRemoveItem(medication)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 rounded-full text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {medication} &times;
          </button>
        ))}
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
