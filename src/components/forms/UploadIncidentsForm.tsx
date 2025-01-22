import React, { useState } from 'react';
import { Incident } from '../../models/profileData.types';
import { useProfileDataContext } from '../../context/ProfileDataContext';

interface UploadIncidentsFormProps {
  onSubmit: () => void;
}

export default function UploadIncidentsForm({ onSubmit }: UploadIncidentsFormProps) {
  const [newIncidents, setNewIncidents] = useState<Incident[]>([]);
  const { incidentList, setIncidentList } = useProfileDataContext();

  const handleIncidentsFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>): void => {
      if (!e?.target?.result) {
        console.log('No file selected');
        return;
      }
      if (typeof e.target.result !== 'string') {
        console.log('File is not a string');
        return;
      }
      const jsonData = JSON.parse(e.target.result);
      const incidents: Incident[] = [];
      for (const incident of jsonData) {
        const {
          id,
          userId,
          datetimeAt,
          type,
          startTime,
          durationHours,
          triggers,
          notes,
          createdAt,
        } = incident;

        if (!userId) {
          console.log('Incident missing userId');
          return;
        }

        if (!datetimeAt) {
          console.log('Incident missing datetimeAt');
          return;
        }

        if (!type) {
          console.log('Incident missing type');
          return;
        }

        if (!startTime) {
          console.log('Incident missing startTime');
          return;
        }

        if (!durationHours) {
          console.log('Incident missing durationHours');
          return;
        }

        if (triggers && !Array.isArray(triggers)) {
          console.log('Incident triggers is not an array');
          return;
        }

        incidents.push({
          id: id || incidents.length + 1,
          userId: userId.toString(),
          datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
          type,
          startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
          durationHours,
          triggers,
          createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
          notes: notes || '',
        });
      }

      setNewIncidents(incidents);
      setIncidentList([...incidentList, ...incidents]);
    };

    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="incidents"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add New Incident
        </label>
        <input
          type="file"
          id="incidents"
          onChange={e => handleIncidentsFileChange(e)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>

      <div>{JSON.stringify(newIncidents)}</div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
