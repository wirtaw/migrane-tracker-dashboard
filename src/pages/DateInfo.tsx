import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { getIsoDate, getIsoTime } from '../lib/utils.ts';
import {
  ITrigger,
  Incident,
  Medication,
  Symptom,
  ILocationData,
} from '../models/profileData.types';

export default function DateInfo() {
  const { date } = useParams();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { incidentList, medicationList, triggerList, symptomList, locationList } =
    useProfileDataContext();
  const [triggerItems, setTriggerItems] = useState<ITrigger[]>([]);
  const [incidentItems, setIncidentItems] = useState<Incident[]>([]);
  const [medicationItems, setMedicationItems] = useState<Medication[]>([]);
  const [symptomItems, setSymptomItems] = useState<Symptom[]>([]);
  const [locationItems, setLocationItems] = useState<ILocationData[]>([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date');
    setSelectedDate(date);

    setIncidentItems(incidentList.filter(item => getIsoDate(item.datetimeAt) === date));
    setMedicationItems(medicationList.filter(item => getIsoDate(item.datetimeAt) === date));
    setTriggerItems(triggerList.filter(item => getIsoDate(item.datetimeAt) === date));
    setSymptomItems(symptomList.filter(item => getIsoDate(item.datetimeAt) === date));
    setLocationItems(locationList.filter(item => getIsoDate(item.datetimeAt) === date));
  }, [date, location.search]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Date {selectedDate} Info
        </h1>

        {incidentItems.length > 0 && (
          <div className="space-y-8 pb-5">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Incidents
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                <table className="table-auto border-separate border border-gray-400">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 p-3">Type</th>
                      <th className="border border-gray-400 p-3">Start date time</th>
                      <th className="border border-gray-400 p-3">Durations (in hours)</th>
                      <th className="border border-gray-400 p-3">Triggers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidentItems.map(incident => (
                      <tr key={'incident-' + incident.id}>
                        <td className="text-left border border-gray-400 p-3">{incident.type}</td>
                        <td className="text-center border border-gray-400 p-3">
                          {getIsoDate(incident.startTime)} {getIsoTime(incident.startTime)}
                        </td>
                        <td className="text-center border border-gray-400 p-3">
                          {incident.durationHours}
                        </td>
                        <td className="text-center border border-gray-400 p-3">
                          {incident.triggers.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </p>
            </section>
          </div>
        )}

        {locationItems.length > 0 && (
          <div className="space-y-8 pb-5">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Location</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {locationItems.map(location => (
                  <>
                    <span>Id - {location.id} </span>
                    <span>latitude - {location.latitude} </span>
                    <span>longitude - {location.longitude} </span>
                  </>
                ))}
              </p>
            </section>
          </div>
        )}

        {triggerItems.length > 0 && (
          <div className="space-y-8 pb-5">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Triggers</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                <table className="table-auto border-separate border border-gray-40">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 p-3">Type</th>
                      <th className="border border-gray-400 p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {triggerItems.map(trigger => (
                      <tr key={'trigger-' + trigger.id}>
                        <td className="text-left border border-gray-400 p-3">{trigger.type}</td>
                        <td className="text-center border border-gray-400 p-3">
                          {getIsoDate(trigger.datetimeAt)} {getIsoTime(trigger.datetimeAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </p>
            </section>
          </div>
        )}

        {medicationItems.length > 0 && (
          <div className="space-y-8 pb-5">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Medications
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                <table className="table-auto border-separate border border-gray-40">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 p-3">Title</th>
                      <th className="border border-gray-400 p-3">Date</th>
                      <th className="border border-gray-400 p-3">Dosage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicationItems.map(medication => (
                      <tr key={'medication-' + medication.id}>
                        <td className="text-left border border-gray-400 p-3">{medication.title}</td>
                        <td className="text-center border border-gray-400 p-3">
                          {getIsoDate(medication.datetimeAt)} {getIsoTime(medication.datetimeAt)}
                        </td>
                        <td className="text-center border border-gray-400 p-3">
                          {medication.dosage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </p>
            </section>
          </div>
        )}

        {symptomItems.length > 0 && (
          <div className="space-y-8 pb-5">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Symptoms</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                <table className="table-auto border-separate border border-gray-40">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 p-3">Type</th>
                      <th className="border border-gray-400 p-3">Date</th>
                      <th className="border border-gray-400 p-3">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {symptomItems.map(symptom => (
                      <tr key={'symptom-' + symptom.id}>
                        <td className="text-left border border-gray-400 p-3">{symptom.type}</td>
                        <td className="text-center border border-gray-400 p-3">
                          {getIsoDate(symptom.datetimeAt)} {getIsoTime(symptom.datetimeAt)}
                        </td>
                        <td className="text-center border border-gray-400 p-3">
                          {symptom.severity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
