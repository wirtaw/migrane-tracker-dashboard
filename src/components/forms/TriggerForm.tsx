import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { useAuth } from '../../context/AuthContext';
import { getIsoDateTimeLocal } from '../../lib/utils';
import { IFormEvent } from '../../models/forms.types';
import {
  createTrigger,
  updateTrigger,
  CreateTriggerDto,
  UpdateTriggerDto,
} from '../../services/triggers';
import { ITrigger } from '../../models/profileData.types';
import Loader from '../Loader';

interface ITriggerFormProps {
  onSubmit: () => void;
  initialData?: ITrigger;
}

export default function TriggerForm({ onSubmit, initialData }: ITriggerFormProps) {
  const { profileSettingsData, apiSession } = useAuth();
  const { triggerEnumList, setTriggerList, setFormErrorMessage, setTriggerEnumList } =
    useProfileDataContext();

  const [typeValue, setTypeValue] = useState<string>(initialData?.type || '');
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(
    initialData?.datetimeAt ? new Date(initialData.datetimeAt) : new Date()
  );
  const [noteValue, setNoteValue] = useState<string>(initialData?.note || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidTrigger = (type: string, datetime: Date) => {
    if (!type) return false;
    if (!datetime) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidTrigger(typeValue, datetimeAtValue)) {
      setFormErrorMessage({ showModal: true, message: 'Please select a type and date' });
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
      if (initialData) {
        const dto: UpdateTriggerDto = {
          type: typeValue,
          note: noteValue,
          datetimeAt: datetimeAtValue.toISOString(),
        };

        const updated = await updateTrigger(initialData.id, dto, apiSession.accessToken);
        setTriggerList(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } else {
        const dto: CreateTriggerDto = {
          type: typeValue,
          note: noteValue,
          userId: apiSession.userId,
          datetimeAt: datetimeAtValue.toISOString(),
        };

        const newTrigger = await createTrigger(dto, apiSession.accessToken);

        // Update local list
        setTriggerList(prev => [...prev, newTrigger]);

        // If it's a new type not in the enum list, add it
        if (!triggerEnumList.includes(newTrigger.type)) {
          setTriggerEnumList(prev => [...prev, newTrigger.type]);
        }
      }

      onSubmit();
    } catch (error) {
      console.error('Failed to create trigger:', error);
      setFormErrorMessage({
        showModal: true,
        message: error instanceof Error ? error.message : 'Failed to create trigger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (event: IFormEvent) => {
    setTypeValue(event.target.value.toString());
  };

  const handleTextareaChange = (event: IFormEvent) => {
    setNoteValue(event.target.value.toString());
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
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
