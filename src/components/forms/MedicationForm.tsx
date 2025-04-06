import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { useAuth } from '../../context/AuthContext';
import { IMedication } from '../../models/profileData.types';
import { getIsoDateTimeLocal } from '../../lib/utils.ts';
import { IFormEvent } from '../../models/forms.types.ts';

interface IMedicationFormProps {
  onSubmit: () => void;
}

export default function MedicationForm({ onSubmit }: IMedicationFormProps) {
  const { profileSettingsData, user } = useAuth();
  const { medicationEnumList, medicationList, setMedicationList, setFormErrorMessage } =
    useProfileDataContext();

  const userId: string = user?.id || '1';
  const [titleValue, setTitleValue] = useState<string>('');
  const [dosageValue, setDosageValue] = useState<number>(0);
  const [dosageMetricValue, setDosageMetricValue] = useState<string>('mg');
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [notesValue, setNotesValue] = useState<string>('');

  const isValidMedication = (medication: IMedication) => {
    if (!medication?.title) {
      return false;
    }

    if (!medication?.dosage) {
      return false;
    }

    if (!medication?.datetimeAt) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    const maxId = Math.max(...medicationList.map(({ id }) => id));
    const medication: IMedication = {
      id: maxId + 1,
      userId,
      title: titleValue,
      dosage: `${dosageValue}${dosageMetricValue}`,
      notes: notesValue,
      createdAt: new Date(),
      datetimeAt: datetimeAtValue,
      updateAt: new Date(),
    };

    if (isValidMedication(medication)) {
      setMedicationList([...medicationList, medication]);
    } else {
      console.error('Invalid medication form');
      setFormErrorMessage({ showModal: true, message: 'Invalid medication form' });
    }

    e.preventDefault();
    onSubmit();
  };

  const handleSelectChange = (event: IFormEvent) => {
    setTitleValue(event.target.value.toString());
  };

  const handleNumberChange = (event: IFormEvent) => {
    setDosageValue(Number(event.target.value));
  };

  const handleSelectMetricChange = (event: IFormEvent) => {
    setDosageMetricValue(event.target.value.toString());
  };

  const handleTextareaChange = (event: IFormEvent) => {
    setNotesValue(event.target.value.toString());
  };

  const handleDateChange = (event: IFormEvent) => {
    setDatetimeAtValue(new Date(event.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="medication"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Medication Title
        </label>
        <select
          id="medication"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={titleValue}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select a medication
          </option>
          {medicationEnumList.map((medication, index) => (
            <option key={index} value={medication}>
              {medication}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="dosage"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Dosage
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            id="dosageValue"
            value={dosageValue}
            onChange={handleNumberChange}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          />
          <select
            value={dosageMetricValue}
            onChange={handleSelectMetricChange}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          >
            <option value="mg">mg</option>
            <option value="ml">ml</option>
            <option value="g">g</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Time Taken
        </label>
        <input
          type="datetime-local"
          id="time"
          value={getIsoDateTimeLocal(datetimeAtValue)}
          onChange={handleDateChange}
          min={getIsoDateTimeLocal(new Date(profileSettingsData?.birthDate))}
          max={getIsoDateTimeLocal(new Date())}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notesValue}
          onChange={handleTextareaChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
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
}
