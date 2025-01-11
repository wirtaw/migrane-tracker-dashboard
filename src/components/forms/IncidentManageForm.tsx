import React, { useState } from 'react';
import { useListsContext } from '../../context/ListsContext';

interface IncidentManageFormProps {
  onSubmit: () => void;
}

export default function IncidentManageForm({ onSubmit }: IncidentManageFormProps) {
  const { incidentList, setIncidentList } = useListsContext();
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([...incidentList]);
  const [newIncident, setNewIncident] = useState('');

  const handleItemClick = (incident: string) => {
    if (!selectedIncidents.includes(incident)) {
      setSelectedIncidents([...selectedIncidents, incident]);
      setIncidentList([...selectedIncidents, incident]);
    }
  };

  const handleRemoveItem = (incident: string) => {
    setSelectedIncidents(selectedIncidents.filter(item => item !== incident));
    setIncidentList([...selectedIncidents.filter(item => item !== incident)]);
  };

  const handleAddNewItem = () => {
    if (newIncident && !incidentList.includes(newIncident)) {
      setIncidentList([...incidentList, newIncident]);
      setSelectedIncidents([...selectedIncidents, newIncident]);
      setNewIncident('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="newIncident"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Add New Incident
        </label>
        <input
          type="text"
          id="newIncident"
          value={newIncident}
          onChange={e => setNewIncident(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAddNewItem}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Incident
        </button>
      </div>

      <div>
        <label
          htmlFor="incidentList"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Incidents
        </label>
        <input
          type="text"
          id="incidentList"
          value={selectedIncidents.join(', ')}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {incidentList.map((incident, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(incident)}
              disabled={selectedIncidents.includes(incident)}
              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium ${
                selectedIncidents.includes(incident)
                  ? 'text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {incident}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {selectedIncidents.map((incident, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleRemoveItem(incident)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 rounded-full text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {incident} &times;
          </button>
        ))}
      </div>

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
