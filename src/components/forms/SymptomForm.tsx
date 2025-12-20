import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { useAuth } from '../../context/AuthContext';

import { getIsoDateTimeLocal } from '../../lib/utils';
import { IFormEvent } from '../../models/forms.types';
import { createSymptom, CreateSymptomDto } from '../../services/symptoms';
import Loader from '../Loader';

interface ISymptomFormProps {
  onSubmit: () => void;
}

export default function SymptomForm({ onSubmit }: ISymptomFormProps) {
  const { profileSettingsData, apiSession } = useAuth();
  const { symptomEnumList, setSymptomList, setFormErrorMessage, setSymptomEnumList } =
    useProfileDataContext();

  const [typeValue, setTypeValue] = useState<string>('');
  const [severityValue, setSeverityValue] = useState<number>(1);
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [notesValue, setNotesValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidSymptom = (type: string, severity: number) => {
    if (!type) return false;
    if (!severity) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidSymptom(typeValue, severityValue)) {
      setFormErrorMessage({ showModal: true, message: 'Please select a type and set severity' });
      return;
    }

    if (!apiSession?.accessToken) {
      setFormErrorMessage({ showModal: true, message: 'Authentication session missing' });
      return;
    }

    if (!apiSession?.userId) {
      setFormErrorMessage({ showModal: true, message: 'User ID missing' });
      return;
    }

    setIsSubmitting(true);

    try {
      const dto: CreateSymptomDto = {
        userId: apiSession.userId,
        type: typeValue,
        severity: severityValue,
        note: notesValue,
        datetimeAt: datetimeAtValue.toISOString(),
      };

      const newSymptom = await createSymptom(dto, apiSession.accessToken);

      setSymptomList(prev => [...prev, newSymptom]);

      if (!symptomEnumList.includes(newSymptom.type)) {
        setSymptomEnumList(prev => [...prev, newSymptom.type]);
      }

      onSubmit();
    } catch (error) {
      console.error('Failed to create symptom:', error);
      setFormErrorMessage({
        showModal: true,
        message: error instanceof Error ? error.message : 'Failed to create symptom',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (event: IFormEvent) => {
    setTypeValue(event.target.value.toString());
  };

  const handleNumberChange = (event: IFormEvent) => {
    setSeverityValue(Number(event.target.value));
  };

  const handleTextareaChange = (event: IFormEvent) => {
    setNotesValue(event.target.value.toString());
  };

  const handleDateChange = (event: IFormEvent) => {
    setDatetimeAtValue(new Date(event.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader />
        </div>
      )}
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
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
