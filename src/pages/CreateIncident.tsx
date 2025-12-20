import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { useAuth } from '../context/AuthContext';
import { getIsoDateTimeLocal } from '../lib/utils';
import { IFormEvent } from '../models/forms.types';
import { IGeomagneticData } from '../components/GeoMagneticWidget';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { createIncident, CreateIncidentDto } from '../services/incidents';
import { ILocationData } from '../models/profileData.types';
import { IncidentTypeEnum } from '../enums/incident-type.enum';

export default function CreateIncident() {
  const {
    apiSession,
    profileSettingsData,
    weatherState,
    geomagneticState,
    fetchForecastHistorical,
    fetchGeomagneticHistorical,
    setLocationDataList,
  } = useAuth();
  const [triggers, setTriggers] = useState<string[]>([]);
  const { triggerEnumList, setIncidentList, formErrorMessage, setFormErrorMessage } =
    useProfileDataContext();

  const defaultWeather = {
    temperature: 0,
    feels_like: 0,
    humidity: 0,
    pressure: 0,
    wind_speed_10m: 0,
    description: '',
    icon: '',
    clouds: 0,
    uvi: 0,
  };
  const deafaultGeomagneticData: IGeomagneticData = {
    solarFlux: 0,
    kIndex: 0,
    aIndex: 0,
    pastWeather: {
      level: '',
    },
    nextWeather: {
      kpIndex: {
        observed: '',
        expected: '',
        rationale: '',
      },
      solarRadiation: {
        rationale: '',
      },
      radioBlackout: {
        rationale: '',
      },
    },
  };

  const currentWeather = weatherState.error
    ? defaultWeather
    : { ...defaultWeather, ...weatherState.data };
  const currentGeomagneticData = geomagneticState.error
    ? deafaultGeomagneticData
    : { ...deafaultGeomagneticData, ...geomagneticState.data };

  const [typeValue, setTypeValue] = useState<IncidentTypeEnum | ''>('');
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
  const [windValue, setWindValue] = useState<number>(currentWeather.wind_speed_10m);
  const [solarFlux, setSolarFlux] = useState<number>(currentGeomagneticData.solarFlux);
  const [kIndex, setKIndex] = useState<number>(currentGeomagneticData.kIndex);
  const [aIndex, setAIndex] = useState<number>(currentGeomagneticData.aIndex);
  const [latitudeValue, setLatitudeValue] = useState<string>(profileSettingsData.latitude);
  const [longitudeValue, setLongitudeValue] = useState<string>(profileSettingsData.longitude);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [changedDate, setChangedDate] = useState(false);
  const [loadForecast, setLoadForecast] = useState(true);

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

  const isWritableLocation = (locationData: ILocationData) => {
    if (
      typeof locationData?.forecast[0]?.temperature !== 'undefined' ||
      typeof locationData?.forecast[0]?.pressure !== 'undefined' ||
      typeof locationData?.forecast[0]?.humidity !== 'undefined' ||
      typeof locationData?.forecast[0]?.clouds !== 'undefined' ||
      typeof locationData?.forecast[0]?.uvi !== 'undefined' ||
      typeof locationData?.forecast[0]?.windSpeed !== 'undefined' ||
      typeof locationData?.solar[0]?.solarFlux !== 'undefined' ||
      typeof locationData?.solar[0]?.kIndex !== 'undefined' ||
      typeof locationData?.solar[0]?.aIndex !== 'undefined'
    ) {
      return true;
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiSession?.accessToken || !apiSession?.userId) {
      setFormErrorMessage({ showModal: true, message: 'Authentication required' });
      return;
    }

    if (!isValidIncident()) {
      setFormErrorMessage({ showModal: true, message: 'Invalid incident form' });
      return;
    }

    setLoading(true);

    try {
      const dto: CreateIncidentDto = {
        userId: apiSession.userId,
        type: typeValue as IncidentTypeEnum,
        startTime: startTimeValue.toISOString(),
        durationHours: durationHoursValue,
        notes: notesValue,
        triggers,
        datetimeAt: datetimeAtValue.toISOString(),
      };

      const newIncident = await createIncident(dto, apiSession.accessToken);
      setIncidentList(prev => [...prev, newIncident]);

      const now = new Date();
      // Sync weather data
      const forecast = await fetchForecastHistorical({
        latitude: parseFloat(latitudeValue),
        longitude: parseFloat(longitudeValue),
        dateTime: datetimeAtValue,
      });

      const solar = await fetchGeomagneticHistorical({
        dateTime: datetimeAtValue,
      });

      const locationData: ILocationData = {
        id: crypto.randomUUID(),
        userId: apiSession.userId,
        latitude: parseFloat(latitudeValue),
        longitude: parseFloat(longitudeValue),
        forecast: [
          {
            description: forecast?.description || '',
            temperature:
              typeof forecast?.temperature !== 'undefined'
                ? forecast.temperature
                : forecastTemperature,
            pressure: typeof forecast?.pressure !== 'undefined' ? forecast.pressure : pressureValue,
            humidity: typeof forecast?.humidity !== 'undefined' ? forecast.humidity : humidityValue,
            windSpeed:
              typeof forecast?.wind_speed_10m !== 'undefined' ? forecast.wind_speed_10m : windValue,
            clouds: typeof forecast?.clouds !== 'undefined' ? forecast.clouds : cloudsValue,
            uvi: typeof forecast?.uvi !== 'undefined' ? forecast.uvi : uviValue,
            datetime: now.toISOString(),
          },
        ],
        solar: [
          {
            solarFlux: solar?.solarFlux || solarFlux,
            kIndex: solar?.kIndex || kIndex,
            aIndex: solar?.aIndex || aIndex,
            bIndex: null,
            flareProbability: null,
            datetime: now.toISOString(),
          },
        ],
        solarRadiation: [],
        datetimeAt: datetimeAtValue,
        incidentId: newIncident.id,
      };

      if (isWritableLocation(locationData)) {
        // In the future this should be a service call, e.g. createLocation(locationData, apiSession.accessToken)
        // For now, updating local state as per previous implementation pattern
        setLocationDataList(prev => [...prev, locationData]);
      }

      setFinished(true);
    } catch (error) {
      console.error('Failed to save incident:', error);
      setFormErrorMessage({
        showModal: true,
        message: error instanceof Error ? error.message : 'Failed to save incident',
      });
      setLoading(false);
    }
  };

  const handleLatitudeChange = (event: IFormEvent) => {
    setLatitudeValue(event.target.value.toString());
  };

  const handleLongitudeChange = (event: IFormEvent) => {
    setLongitudeValue(event.target.value.toString());
  };

  const handleNumberChange = (event: IFormEvent) => {
    setDurationHoursValue(Number(event.target.value));
  };

  const handleDateChange = async (event: IFormEvent) => {
    const dt: Date = new Date(event.target.value);
    if (dt.toString() !== 'Invalid Date') {
      setStartTimeValue(dt);
      setDatetimeAtValue(dt);
      setChangedDate(true);
      setLoadForecast(false);
    }
  };

  const handleSelectChange = (event: IFormEvent) => {
    setTypeValue(event.target.value as IncidentTypeEnum);
  };

  const handleTextareaChange = (event: IFormEvent) => {
    setNotesValue(event.target.value.toString());
  };

  const handleForecastTemperatureChange = (event: IFormEvent) => {
    setForecastTemperature(Number(event.target.value));
  };

  const handleForecastHumidityChange = (event: IFormEvent) => {
    setHumidityValue(Number(event.target.value));
  };

  const handleForecastPressureChange = (event: IFormEvent) => {
    setPressureValue(Number(event.target.value));
  };

  const handleForecastCloudsChange = (event: IFormEvent) => {
    setCloudsValue(Number(event.target.value));
  };

  const handleForecastUviChange = (event: IFormEvent) => {
    setUviValue(Number(event.target.value));
  };

  const handleForecastWindChange = (event: IFormEvent) => {
    setWindValue(Number(event.target.value));
  };

  const handleSolarFluxChange = (event: IFormEvent) => {
    setSolarFlux(Number(event.target.value));
  };

  const handleKIndexChange = (event: IFormEvent) => {
    setKIndex(Number(event.target.value));
  };

  const handleAIndexChange = (event: IFormEvent) => {
    setAIndex(Number(event.target.value));
  };

  const handleWeatherCall = async () => {
    const forecast = await fetchForecastHistorical({
      latitude: parseFloat(latitudeValue),
      longitude: parseFloat(longitudeValue),
      dateTime: datetimeAtValue,
    });

    if (typeof forecast?.temperature !== 'undefined') {
      setForecastTemperature(Number(forecast.temperature));
    }

    if (typeof forecast?.humidity !== 'undefined') {
      setHumidityValue(Number(forecast.humidity));
    }

    if (typeof forecast?.pressure !== 'undefined') {
      setPressureValue(Number(forecast.pressure));
    }

    if (typeof forecast?.clouds !== 'undefined') {
      setCloudsValue(Number(forecast.clouds));
    }

    const solar = await fetchGeomagneticHistorical({
      dateTime: datetimeAtValue,
    });

    console.info(`solar ${JSON.stringify(solar)}`);
    setLoadForecast(true);
  };

  if (loading && finished) {
    return <Navigate to="/dashboard" replace />;
  }

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
              <div className="prose dark:prose-invert max-w-none">
                {changedDate && !loadForecast && (
                  <button
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleWeatherCall}
                  >
                    Load weather
                  </button>
                )}
              </div>
            </section>
            {loading && !finished && <Loader />}
            {!loading && !finished && (
              <form
                onSubmit={handleSubmit}
                className="space-y-8 mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
              >
                {/* Form Content - simplified for brevity, structure remains same */}
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
                        {Object.values(IncidentTypeEnum).map((option, index) => (
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
                        // min={getIsoDateTimeLocal(new Date(profileSettingsData?.birthDate))} // Removed as irrelevant constraint for logging
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
                    {/* Triggers Section */}
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
                    {/* Notes Section */}
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

                {/* Location and Weather Section - same as before but inside valid form tags */}
                <section className="m-0">
                  <div className="border-2 border-indigo-600 dark:border-white p-2">
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-300 dark:text-white">Location</p>
                    </div>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <label htmlFor="latitude" className="block text-sm font-medium">
                        Latitude
                      </label>
                      <input
                        type="text"
                        id="latitude"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                        value={latitudeValue}
                        onChange={handleLatitudeChange}
                      />
                    </div>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <label htmlFor="longitude" className="block text-sm font-medium">
                        Longitude
                      </label>
                      <input
                        type="text"
                        id="longitude"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                        value={longitudeValue}
                        onChange={handleLongitudeChange}
                      />
                    </div>
                  </div>
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
                        htmlFor="forecastWind"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Wind 10m (m/s)
                      </label>
                      <input
                        type="number"
                        id="forecastWind"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                        value={windValue}
                        onChange={handleForecastWindChange}
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
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <label htmlFor="solarFlux" className="block text-sm font-medium">
                        Solar Flux (sfu)
                      </label>
                      <input
                        type="number"
                        id="solarFlux"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                        value={solarFlux}
                        onChange={handleSolarFluxChange}
                      />
                    </div>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <label htmlFor="kIndex" className="block text-sm font-medium">
                        K-Index
                      </label>
                      <input
                        type="number"
                        id="kIndex"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                        value={kIndex}
                        onChange={handleKIndexChange}
                      />
                    </div>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <label htmlFor="aIndex" className="block text-sm font-medium">
                        A-Index
                      </label>
                      <input
                        type="number"
                        id="aIndex"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                        value={aIndex}
                        onChange={handleAIndexChange}
                      />
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
            )}
          </div>
        </div>
      </main>
      <Modal
        isOpen={formErrorMessage.showModal === true}
        onClose={() => setFormErrorMessage({ showModal: false, message: '' })}
        title="Error message"
      >
        <div className="text-red-500 text-sm mt-1 dark:text-white">
          <p>{formErrorMessage.message}</p>
        </div>
      </Modal>
    </>
  );
}
