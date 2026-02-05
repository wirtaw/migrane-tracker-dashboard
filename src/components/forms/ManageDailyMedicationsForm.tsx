import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import {
  getDailyMedications,
  addDailyMedication,
  removeDailyMedication,
  DailyMedication,
} from '../../lib/daily-medications';
import { useProfileDataContext } from '../../context/ProfileDataContext';

export default function ManageDailyMedicationsForm() {
  const { medicationEnumList } = useProfileDataContext();
  const [medications, setMedications] = useState<DailyMedication[]>([]);

  const [newTitle, setNewTitle] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newUnit, setNewUnit] = useState('mg');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    setMedications(getDailyMedications());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDosage) return;

    const updated = addDailyMedication({
      title: newTitle,
      dosage: newDosage,
      unit: newUnit,
      time: newTime,
    });
    setMedications(updated);

    // Reset form
    setNewTitle('');
    setNewDosage('');
    setNewTime('');
  };

  const handleRemove = (id: string) => {
    const updated = removeDailyMedication(id);
    setMedications(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          Add New Preset
        </h3>
        <form onSubmit={handleAdd} className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Medication
            </label>
            <input
              list="medication-suggestions"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
              placeholder="e.g. Ibuprofen"
            />
            <datalist id="medication-suggestions">
              {medicationEnumList.map(m => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Dosage</label>
            <input
              type="number"
              value={newDosage}
              onChange={e => setNewDosage(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
              placeholder="0"
            />
          </div>
          <div className="w-20">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Unit</label>
            <select
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
            >
              <option value="mg">mg</option>
              <option value="ml">ml</option>
              <option value="g">g</option>
              <option value="µg">µg</option>
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Time</label>
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
            />
          </div>
          <button
            type="submit"
            disabled={!newTitle || !newDosage}
            className="p-2 mb-[1px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Current Presets</h3>
        {medications.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">
            No daily medications configured.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {medications.map(med => (
              <li key={med.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{med.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {med.dosage}
                    {med.unit}
                    {med.time && <span className="ml-2 text-indigo-500">@ {med.time}</span>}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(med.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
