import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { useAuth } from '../../context/AuthContext';
import { getIsoDateTimeLocal } from '../../lib/utils';
import { IFormEvent } from '../../models/forms.types';
import { createIncident, CreateIncidentDto } from '../../services/incidents';

interface IIncidentFormProps {
  onSubmit: () => void;
}

export default function IncidentForm({ onSubmit }: IIncidentFormProps) {
  const { apiSession } = useAuth();
  const [triggers, setTriggers] = useState<string[]>([]);
  const { triggerEnumList, setIncidentList, incidentTypeEnumList, setFormErrorMessage } =
    useProfileDataContext();
  const navigate = useNavigate();

  const [typeValue, setTypeValue] = useState<string | ''>('');
  const [durationHoursValue, setDurationHoursValue] = useState<string>('0.5');
  const [startTimeValue, setStartTimeValue] = useState<Date>(new Date());
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [notesValue, setNotesValue] = useState<string>('');

  const isValidIncident = () => {
    if (!typeValue) {
      return false;
    }
    if (!durationHoursValue) {
      return false;
    }
    return true;
  };

  const handleTagClick = (tag: string) => {
    const triggerList: string[] = [...new Set([...triggers, tag])];
    setTriggers(triggerList);
  };

  const handleClearTriggers = () => {
    setTriggers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiSession?.accessToken || !apiSession?.userId) {
      setFormErrorMessage({ showModal: true, message: 'Authentication required' });
      return;
    }

    if (!isValidIncident()) {
      setFormErrorMessage({ showModal: true, message: 'Please fill in all required fields' });
      return;
    }

    try {
      const dto: CreateIncidentDto = {
        userId: apiSession.userId,
        type: typeValue,
        startTime: startTimeValue.toISOString(),
        durationHours: parseFloat(durationHoursValue),
        notes: notesValue,
        triggers,
        datetimeAt: datetimeAtValue.toISOString(),
      };

      const newIncident = await createIncident(dto, apiSession.accessToken);
      setIncidentList(prev => [...prev, newIncident]);
      onSubmit();
    } catch (error) {
      console.error('Failed to save incident:', error);
      setFormErrorMessage({
        showModal: true,
        message: error instanceof Error ? error.message : 'Failed to save incident',
      });
    }
  };

  const handleNumberChange = (event: IFormEvent) => {
    setDurationHoursValue(String(event.target.value));
  };

  const handleDateChange = (event: IFormEvent) => {
    setStartTimeValue(new Date(event.target.value));
    setDatetimeAtValue(new Date(event.target.value));
  };

  const handleSelectChange = (event: IFormEvent) => {
    setTypeValue(event.target.value as string);
  };

  const handleTextareaChange = (event: IFormEvent) => {
    setNotesValue(event.target.value.toString());
  };

  const openCreateIncident = () => {
    navigate('/create-incident');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white dark:bg-gray-800 space-y-4 rounded-xl shadow-sm">
        <button
          type="button"
          onClick={openCreateIncident}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-black bg-gray-800 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Expand create
        </button>
      </div>
      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Incident Type
        </label>
        <select
          id="type"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={typeValue}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select a type
          </option>
          {incidentTypeEnumList.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="start"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Start Time
        </label>
        <input
          type="datetime-local"
          id="start"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={getIsoDateTimeLocal(startTimeValue)}
          onChange={handleDateChange}
          max={getIsoDateTimeLocal(new Date())}
        />
      </div>

      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Duration (hours)
        </label>
        <input
          type="number"
          id="duration"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={durationHoursValue}
          onChange={handleNumberChange}
          onFocus={e => e.target.select()}
        />
      </div>

      <div>
        <label
          htmlFor="triggers"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Potential Triggers
        </label>
        <input
          type="text"
          id="triggers"
          value={triggers.join(', ')}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {triggerEnumList.map((trigger, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTagClick(trigger)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {trigger}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleClearTriggers}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Clear Triggers
        </button>
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
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={notesValue}
          onChange={handleTextareaChange}
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
