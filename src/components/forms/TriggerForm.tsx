import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { useAuth } from '../../context/AuthContext';
import { ITrigger } from '../../models/profileData.types';
import { getIsoDateTimeLocal } from '../../lib/utils.ts';
import { FormEvent } from '../../models/forms.types.ts';

interface TriggerFormProps {
  onSubmit: () => void;
}

export default function TriggerForm({ onSubmit }: TriggerFormProps) {
  const { user, profileSettingsData } = useAuth();
  const { triggerEnumList, triggerList, setTriggerList, setFormErrorMessage } =
    useProfileDataContext();

  const userId: string = user?.id || '1';
  const [typeValue, setTypeValue] = useState<string>('');
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [noteValue, setNoteValue] = useState<string>('');

  const isValidTrigger = (trigger: ITrigger) => {
    if (!trigger?.type) {
      return false;
    }

    if (!trigger?.datetimeAt) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    const maxId = Math.max(...triggerList.map(({ id }) => id));
    const trigger: ITrigger = {
      id: maxId + 1,
      userId,
      type: typeValue,
      note: noteValue,
      createdAt: new Date(),
      datetimeAt: datetimeAtValue,
    };

    if (isValidTrigger(trigger)) {
      setTriggerList([...triggerList, trigger]);
    } else {
      console.error('Invalid trigger form');
      setFormErrorMessage({ showModal: true, message: 'Invalid trigger form' });
    }

    e.preventDefault();
    onSubmit();
  };

  const handleSelectChange = (event: FormEvent) => {
    setTypeValue(event.target.value.toString());
  };

  const handleTextareaChange = (event: FormEvent) => {
    setNoteValue(event.target.value.toString());
  };

  const handleDateChange = (event: FormEvent) => {
    setDatetimeAtValue(new Date(event.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="trigger"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Trigger Type
        </label>
        <select
          id="trigger"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={typeValue}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select a type
          </option>
          {triggerEnumList.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="time"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Date
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
          Note
        </label>
        <textarea
          id="notes"
          rows={3}
          value={noteValue}
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
