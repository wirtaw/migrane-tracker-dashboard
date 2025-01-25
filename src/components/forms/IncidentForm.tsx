import React, { useState } from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Incident,
} from '../../models/profileData.types';

interface IncidentFormProps {
  onSubmit: () => void;
}

const isValidIncident = (formData: Incident) => {
  if (!formData?.type) {
    return false;
  }

  if (!formData?.durationHours) {
    return false;
  }

  if (!formData?.triggers.length) {
    return false;
  }

  return true;
};

export default function IncidentForm({ onSubmit }: IncidentFormProps) {
  const { user } = useAuth();
  const [triggers, setTriggers] = useState<string[]>([]);
  const { incidentEnumList, triggerEnumList, incidentList, setIncidentList } = useProfileDataContext();
  const maxId = Math.max(...incidentList.map(({ id }) => id));
  const userId: string = user?.id || '1';

  const [formData, setFormData] = useState<Incident>({
    id: maxId + 1,
    userId,
    type: '',
    startTime: new Date(),
    durationHours: 0.5,
    triggers: [],
    notes: '',
    createdAt: new Date(),
    datetimeAt: new Date()
  });

  const handleTagClick = (tag: string) => {
    const triggerList : string[] = [...new Set([...triggers, tag])];
    setTriggers(triggerList);
    setFormData({
      ...formData,
      triggers: triggerList,
    });
  };

  const handleClearTriggers = () => {
    setTriggers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isValidIncident(formData)) {
      incidentList.push(formData);
      setIncidentList(incidentList);

      e.preventDefault();
      onSubmit();
    } else {
      console.log('Invalid incident form');
    }
  };

  const handleNumberChange = (event: { target: { value: string | number | Date; }; }) => {
    setFormData({
      ...formData,
      durationHours: Number(event.target.value),
    });
  };

  const handleTextChange = (event: { target: { value: string | number | Date; }; }) => {
    setFormData({
      ...formData,
      triggers: event.target.value.toString().split(','),
    });
  };

  const handleDateChange = (event: { target: { value: string | number | Date; }; }) => {
    setFormData({
      ...formData,
      startTime: new Date(event.target.value),
    });
  };

  const handleSelectChange = (event: { target: { value: string | number | Date; }; }) => {
    setFormData({
      ...formData,
      type: event.target.value.toString(),
    });
  };

  const handleTextareaChange = (event: { target: { value: string | number | Date; }; }) => {
    setFormData({
      ...formData,
      notes: event.target.value.toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          defaultValue=""
          value={formData.type}
          onChange={handleSelectChange}
        >
          <option value="" disabled>
            Select a type
          </option>
          {incidentEnumList.map((option, index) => (
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
          value={formData.startTime.toISOString()}
          onChange={handleDateChange}
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
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
          value={formData.durationHours}
          onChange={handleNumberChange}
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
          onChange={handleTextChange}
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
          value={formData.notes}
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
