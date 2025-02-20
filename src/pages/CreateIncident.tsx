import React, { useState } from 'react';
import { useProfileDataContext } from '../context/ProfileDataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Incident } from '../models/profileData.types.ts';
import { getIsoDateTimeLocal } from '../lib/utils.ts';
import { FormEvent } from '../models/forms.types.ts';

export default function CreateIncident() {
  const { user, profileSettingsData } = useAuth();
  const [triggers, setTriggers] = useState<string[]>([]);
  const { incidentEnumList, triggerEnumList, incidentList, setIncidentList, setFormErrorMessage } =
    useProfileDataContext();

  const userId: string = user?.id || '1';
  const [typeValue, setTypeValue] = useState<string>('');
  const [durationHoursValue, setDurationHoursValue] = useState<number>(0.5);
  const [startTimeValue, setStartTimeValue] = useState<Date>(new Date());
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [notesValue, setNotesValue] = useState<string>('');

  const isValidIncident = (incident: Incident) => {
    if (!incident?.type) {
      return false;
    }

    if (!incident?.durationHours) {
      return false;
    }

    if (!incident?.triggers.length) {
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

  const handleSubmit = (e: React.FormEvent) => {
    const maxId = Math.max(...incidentList.map(({ id }) => id));
    const incident: Incident = {
      id: maxId + 1,
      userId,
      durationHours: durationHoursValue,
      type: typeValue,
      startTime: startTimeValue,
      createdAt: new Date(),
      datetimeAt: datetimeAtValue,
      triggers,
      notes: notesValue,
    };

    if (isValidIncident(incident)) {
      setIncidentList([...incidentList, incident]);
    } else {
      console.error('Invalid incident form');
      setFormErrorMessage({ showModal: true, message: 'Invalid incident form' });
    }

    e.preventDefault();
  };

  const handleNumberChange = (event: FormEvent) => {
    setDurationHoursValue(Number(event.target.value));
  };

  const handleDateChange = (event: FormEvent) => {
    setStartTimeValue(new Date(event.target.value));
    setDatetimeAtValue(new Date(event.target.value));
  };

  const handleSelectChange = (event: FormEvent) => {
    setTypeValue(event.target.value.toString());
  };

  const handleTextareaChange = (event: FormEvent) => {
    setNotesValue(event.target.value.toString());
  };

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Add complete incident</p>
            </div>
          </div>

          <div>
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
                  value={typeValue}
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
                  value={getIsoDateTimeLocal(startTimeValue)}
                  onChange={handleDateChange}
                  min={getIsoDateTimeLocal(new Date(profileSettingsData?.birthDate))}
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
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                  value={durationHoursValue}
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
          </div>
        </div>
      </main>
    </>
  );
}
