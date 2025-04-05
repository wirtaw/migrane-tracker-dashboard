import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useParams, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { getIsoDate } from '../lib/utils';
import {
  ITrigger,
  IIncident,
  IMedication,
  ISymptom,
  ILocationData,
} from '../models/profileData.types';
import IncidentCard from '../components/cards/IncidentCard';
import ForecastCard from '../components/cards/ForecastCard';
import TriggerCard from '../components/cards/TriggerCard';
import MedicationCard from '../components/cards/MedicationCard';
import SymptomCard from '../components/cards/SymptomsCard';

export default function DateInfo() {
  const { date } = useParams();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());
  const { incidentList, medicationList, triggerList, symptomList, locationList } =
    useProfileDataContext();
  const [triggerItems, setTriggerItems] = useState<ITrigger[]>([]);
  const [incidentItems, setIncidentItems] = useState<IIncident[]>([]);
  const [medicationItems, setMedicationItems] = useState<IMedication[]>([]);
  const [symptomItems, setSymptomItems] = useState<ISymptom[]>([]);
  const [locationItems, setLocationItems] = useState<ILocationData[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dateValue = queryParams.get('date');
    const date = dateValue ? DateTime.fromISO(dateValue) : DateTime.now();
    setSelectedDate(date.isValid ? date : DateTime.now());

    setIncidentItems(incidentList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
    setMedicationItems(
      medicationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate())
    );
    setTriggerItems(triggerList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
    setSymptomItems(symptomList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
    setLocationItems(locationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
  }, [date, location.search]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Date {selectedDate.toLocaleString()} Info
        </h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {incidentItems.length > 0 && (
          <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Incidents
                </h2>
              </div>
              {incidentItems.map(incident => (
                <IncidentCard
                  key={'incident-' + selectedDate.toMillis() + '-card-' + incident.id}
                  incident={incident}
                />
              ))}
            </section>
          </div>
        )}

        {locationItems.length > 0 && (
          <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Location</h2>
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {locationItems.map(location => (
                  <div key={'location-' + location.id}>
                    <p>
                      <span>
                        Coordinates - {location.latitude} / {location.longitude}
                      </span>
                      <br />
                      {location.forecast && (
                        <>
                          {location.forecast.map((forecast, index) => (
                            <ForecastCard
                              key={'location-' + location.id + '-forecast-' + index}
                              forecast={forecast}
                            />
                          ))}
                        </>
                      )}
                      <br />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {triggerItems.length > 0 && (
          <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Triggers</h2>
              </div>
              {triggerItems.map(trigger => (
                <TriggerCard
                  key={'trigger-' + selectedDate.toMillis() + '-card-' + trigger.id}
                  trigger={trigger}
                />
              ))}
            </section>
          </div>
        )}

        {medicationItems.length > 0 && (
          <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Medications
                </h2>
              </div>
              {medicationItems.map(medication => (
                <MedicationCard
                  key={'medication-' + selectedDate.toMillis() + '-card-' + medication.id}
                  medication={medication}
                />
              ))}
            </section>
          </div>
        )}

        {symptomItems.length > 0 && (
          <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Symptoms</h2>
              </div>
              {symptomItems.map(symptom => (
                <SymptomCard
                  key={'symptom-' + selectedDate.toMillis() + '-card-' + symptom.id}
                  symptom={symptom}
                />
              ))}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
