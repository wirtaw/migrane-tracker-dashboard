import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { useAuth } from '../context/AuthContext';
import { getIsoDateTimeLocal } from '../lib/utils';
import { IFormEvent } from '../models/forms.types';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { updateIncident, UpdateIncidentDto } from '../services/incidents';

export default function EditIncident() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiSession } = useAuth();

  const {
    triggerEnumList,
    setIncidentList,
    incidentList,
    formErrorMessage,
    setFormErrorMessage,
    incidentTypeEnumList,
  } = useProfileDataContext();

  const [triggers, setTriggers] = useState<string[]>([]);
  const [typeValue, setTypeValue] = useState<string | ''>('');
  const [durationHoursValue, setDurationHoursValue] = useState<number>(0.5);
  const [startTimeValue, setStartTimeValue] = useState<Date>(new Date());
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [notesValue, setNotesValue] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (id && incidentList.length > 0) {
      const incident = incidentList.find(i => i.id.toString() === id);
      if (incident) {
        setTypeValue(incident.type);
        setDurationHoursValue(incident.durationHours);
        setStartTimeValue(new Date(incident.startTime));
        setDatetimeAtValue(new Date(incident.datetimeAt));
        setNotesValue(incident.notes || '');
        setTriggers(incident.triggers || []);
        setInitialLoading(false);
      } else {
        // Handle incident not found
        setInitialLoading(false);
        setFormErrorMessage({ showModal: true, message: 'Incident not found' });
      }
    } else if (incidentList.length > 0) {
      setInitialLoading(false);
    }
  }, [id, incidentList, setFormErrorMessage]);

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
    if (!apiSession?.accessToken || !apiSession?.userId || !id) {
      setFormErrorMessage({ showModal: true, message: 'Authentication required or missing ID' });
      return;
    }

    if (!isValidIncident()) {
      setFormErrorMessage({ showModal: true, message: 'Invalid incident form' });
      return;
    }

    setLoading(true);

    try {
      const dto: UpdateIncidentDto = {
        type: typeValue as string,
        startTime: startTimeValue.toISOString(),
        durationHours: durationHoursValue,
        notes: notesValue,
        triggers,
        datetimeAt: datetimeAtValue.toISOString(),
      };

      const updatedIncident = await updateIncident(id, dto, apiSession.accessToken);

      setIncidentList(prev => prev.map(i => (i.id.toString() === id ? updatedIncident : i)));
      setFinished(true);
    } catch (error) {
      console.error('Failed to update incident:', error);
      setFormErrorMessage({
        showModal: true,
        message: error instanceof Error ? error.message : 'Failed to update incident',
      });
      setLoading(false);
    }
  };

  const handleNumberChange = (event: IFormEvent) => {
    setDurationHoursValue(Number(event.target.value));
  };

  const handleDateChange = (event: IFormEvent) => {
    const dt: Date = new Date(event.target.value);
    if (dt.toString() !== 'Invalid Date') {
      setStartTimeValue(dt);
      setDatetimeAtValue(dt);
    }
  };

  const handleSelectChange = (event: IFormEvent) => {
    setTypeValue(event.target.value as string);
  };

  const handleTextareaChange = (event: IFormEvent) => {
    setNotesValue(event.target.value.toString());
  };

  if (finished) {
    return <Navigate to="/dashboard" replace />;
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <main className="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Incident</h1>
            </div>
          </div>

          <div className="space-y-12">
            <section className="space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 dark:text-white">
                  Update incident details
                </p>
              </div>
            </section>

            {loading && !finished && <Loader />}

            {!loading && !finished && (
              <form onSubmit={handleSubmit} className="space-y-8 mt-5 max-w-2xl">
                <div className="space-y-4 border-2 border-indigo-600 dark:border-white p-6 rounded-lg">
                  <div className="space-y-2">
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

                  <div className="space-y-2">
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

                  <div className="space-y-2">
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
                    />
                  </div>

                  <div className="space-y-2">
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
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm bg-gray-50 dark:bg-gray-600"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {triggerEnumList.map((trigger, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleTagClick(trigger)}
                          className={`inline-flex items-center px-3 py-1.5 border rounded-full text-sm font-medium transition-colors ${
                            triggers.includes(trigger)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
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

                  <div className="space-y-2">
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
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={formErrorMessage.showModal === true}
        onClose={() => setFormErrorMessage({ showModal: false, message: '' })}
        title="Error"
      >
        <div className="text-red-500 text-sm mt-1 dark:text-white">
          <p>{formErrorMessage.message}</p>
        </div>
      </Modal>
    </>
  );
}
