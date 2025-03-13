import React, { useState } from 'react';
import { useProfileDataContext } from '../context/ProfileDataContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Incident } from '../models/profileData.types.ts';
import { getIsoDateTimeLocal } from '../lib/utils.ts';
import { FormEvent } from '../models/forms.types.ts';

export default function CreateIncident() {
  const { user, profileSettingsData, forecastData, forecastError } = useAuth();
  const [triggers, setTriggers] = useState<string[]>([]);
  const { incidentEnumList, triggerEnumList, incidentList, setIncidentList, setFormErrorMessage } =
    useProfileDataContext();

  const defaultWeather = {
    temperature: 20,
    feels_like: 10,
    humidity: 65,
    pressure: 1013,
    description: 'Clear sky',
    icon: '01d',
    clouds: 20,
    uvi: 4.5,
  };

  const currentWeather = forecastError ? defaultWeather : { ...defaultWeather, ...forecastData };

  const userId: string = user?.id || '1';
  const [typeValue, setTypeValue] = useState<string>('');
  const [durationHoursValue, setDurationHoursValue] = useState<number>(0.5);
  const [startTimeValue, setStartTimeValue] = useState<Date>(new Date());
  const [datetimeAtValue, setDatetimeAtValue] = useState<Date>(new Date());
  const [notesValue, setNotesValue] = useState<string>('');
  const [forecastTemperature, setForecastTemperature] = useState<number>(
    currentWeather.temperature
  );
  const [humidityValue, setHumidityValue] = useState<number>(currentWeather.humidity);
  const [pressureValue, setPressureValue] = useState<number>(currentWeather.pressure);
  const [cloudsValue, setCloudsValue] = useState<number>(currentWeather.clouds);
  const [uviValue, setUviValue] = useState<number>(currentWeather.uvi);

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

  const handleForecastTemperatureChange = (event: FormEvent) => {
    setForecastTemperature(Number(event.target.value));
  };

  const handleForecastHumidityChange = (event: FormEvent) => {
    setHumidityValue(Number(event.target.value));
  };

  const handleForecastPressureChange = (event: FormEvent) => {
    setPressureValue(Number(event.target.value));
  };

  const handleForecastCloudsChange = (event: FormEvent) => {
    setCloudsValue(Number(event.target.value));
  };

  const handleForecastUviChange = (event: FormEvent) => {
    setUviValue(Number(event.target.value));
  };

  return (
    <>
      <main className="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
            </div>
          </div>

          <div className="space-y-12">
            <section className="space-y-8">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 dark:text-white">
                  Add complete incident
                </p>
              </div>
            </section>
            <form
              onSubmit={handleSubmit}
              className="space-y-8 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              <section className="space-x-0 space-y-0">
                <div className="space-y-4 border-2 border-indigo-600 dark:border-white p-2">
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
                      {incidentEnumList.map((option, index) => (
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
                      min={getIsoDateTimeLocal(new Date(profileSettingsData?.birthDate))}
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
              </section>
              <section className="m-0">
                <div className="border-2 border-indigo-600 dark:border-white p-2">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300 dark:text-white">Weather</p>
                  </div>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <label htmlFor="forecastTemperature" className="block text-sm font-medium">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      id="forecastTemperature"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                      value={forecastTemperature}
                      onChange={handleForecastTemperatureChange}
                    />
                  </div>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <label
                      htmlFor="forecastHumidity"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      id="forecastHumidity"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                      value={humidityValue}
                      onChange={handleForecastHumidityChange}
                    />
                  </div>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <label
                      htmlFor="forecastPressure"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Pressure (hPa)
                    </label>
                    <input
                      type="number"
                      id="forecastPressure"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                      value={pressureValue}
                      onChange={handleForecastPressureChange}
                    />
                  </div>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <label
                      htmlFor="forecastUvi"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      UV Index
                    </label>
                    <input
                      type="number"
                      id="forecastUvi"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                      value={uviValue}
                      onChange={handleForecastUviChange}
                    />
                  </div>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <label
                      htmlFor="forecastClouds"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Cloud Cover (%)
                    </label>
                    <input
                      type="number"
                      id="forecastClouds"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                      value={cloudsValue}
                      onChange={handleForecastCloudsChange}
                    />
                  </div>
                </div>
                <div className="border-2 border-indigo-600 dark:border-white p-2 mt-2">
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300 dark:text-white">Solar</p>
                  </div>
                </div>
              </section>
              <section className="lg:col-span-2">
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
