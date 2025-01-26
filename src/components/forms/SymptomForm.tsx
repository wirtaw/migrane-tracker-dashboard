import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { useAuth } from '../../context/AuthContext';
import { Symptom } from '../../models/profileData.types';
import { getIsoDateTimeLocal } from '../../lib/utils.ts';
import { FormEvent } from '../../models/forms.types.ts';

interface SymptomFormProps {
  onSubmit: () => void;
}

export default function SymptomForm({ onSubmit }: SymptomFormProps) {
  const { user } = useAuth();
  const { symptomEnumList, symptomList, setSymptomList, setFormErrorMessage, profileSettingsData } =
    useProfileDataContext();

  const userId: string = user?.id || '1';
  const [typeValue, setTypeValue] = useState<string>('');
  const [severityValue, setSeverityValue] = useState<number>(1);
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [notesValue, setNotesValue] = useState<string>('');

  const isValidSymptom = (symptom: Symptom) => {
    if (!symptom?.type) {
      return false;
    }

    if (!symptom?.severity) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    const maxId = Math.max(...symptomList.map(({ id }) => id));
    const symptom: Symptom = {
      id: maxId + 1,
      userId,
      type: typeValue,
      severity: severityValue,
      notes: notesValue,
      createdAt: new Date(),
      datetimeAt: datetimeAtValue,
    };

    if (isValidSymptom(symptom)) {
      setSymptomList([...symptomList, symptom]);
    } else {
      console.error('Invalid symptom form');
      setFormErrorMessage({ showModal: true, message: 'Invalid symptom form' });
    }

    e.preventDefault();
    onSubmit();
  };

  const handleSelectChange = (event: FormEvent) => {
    setTypeValue(event.target.value.toString());
  };

  const handleNumberChange = (event: FormEvent) => {
    setSeverityValue(Number(event.target.value));
  };

  const handleTextareaChange = (event: FormEvent) => {
    setNotesValue(event.target.value.toString());
  };

  const handleDateChange = (event: FormEvent) => {
    setDatetimeAtValue(new Date(event.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="symptom"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Symptom Type
        </label>
        <select
          id="symptom"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={typeValue}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select a symptom
          </option>
          {symptomEnumList.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="severity"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Severity (1-10)
        </label>
        <input
          type="number"
          id="severity"
          min="1"
          max="10"
          value={severityValue}
          onChange={handleNumberChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="start"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Time
        </label>
        <input
          type="datetime-local"
          id="start"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={getIsoDateTimeLocal(datetimeAtValue)}
          onChange={handleDateChange}
          min={getIsoDateTimeLocal(new Date(profileSettingsData?.birthDate))}
          max={getIsoDateTimeLocal(new Date())}
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
