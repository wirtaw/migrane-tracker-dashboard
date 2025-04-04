import React, { useState, useEffect, useMemo } from 'react';
import { ReceiptText } from 'lucide-react';

import { Incident, ITrigger, Medication, Symptom } from '../models/profileData.types';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { getIsoDate, getIsoTime } from '../lib/utils.ts';
import { FormEvent } from '../models/forms.types.ts';

interface MostRecentDataProps {
  targetDate?: Date;
}

interface FilteredData {
  incidents: Incident[];
  triggers: ITrigger[];
  medications: Medication[];
  symptoms: Symptom[];
}

export default function MostRecentData({ targetDate = new Date() }: MostRecentDataProps) {
  const { incidentList, triggerList, medicationList, symptomList } = useProfileDataContext();
  const [existDataExport, setExistDataExport] = useState<boolean>(false);
  const [days, setDays] = useState<number>(30);
  const [typeValue, setTypeValue] = useState<string>('incidents');

  useEffect(() => {
    const hasData =
      incidentList &&
      Array.isArray(incidentList) &&
      incidentList.length > 0 &&
      triggerList &&
      Array.isArray(triggerList) &&
      triggerList.length > 0 &&
      medicationList &&
      Array.isArray(medicationList) &&
      medicationList.length > 0 &&
      symptomList &&
      Array.isArray(symptomList) &&
      symptomList.length > 0;
    const dt = new Date();
    if (dt.getTime() - targetDate.getTime() < 30 * 86400 * 1000) {
      setDays(30);
    } else {
      setDays(Math.ceil(((dt.getTime() - targetDate.getTime()) / 86400) * 1000));
    }

    setExistDataExport(hasData);
  }, [incidentList, triggerList, medicationList, symptomList, targetDate]);

  const filterData = useMemo<FilteredData>(() => {
    const dt = new Date(new Date().getTime() - days * 86400 * 1000);
    return {
      incidents:
        incidentList
          .filter(({ datetimeAt }) => datetimeAt.getTime() > dt.getTime())
          .sort((a, b) => b.datetimeAt.getTime() - a.datetimeAt.getTime()) || [],
      triggers:
        triggerList
          .filter(({ datetimeAt }) => datetimeAt.getTime() > dt.getTime())
          .sort((a, b) => b.datetimeAt.getTime() - a.datetimeAt.getTime()) || [],
      medications:
        medicationList
          .filter(({ datetimeAt }) => datetimeAt.getTime() > dt.getTime())
          .sort((a, b) => b.datetimeAt.getTime() - a.datetimeAt.getTime()) || [],
      symptoms:
        symptomList
          .filter(({ datetimeAt }) => datetimeAt.getTime() > dt.getTime())
          .sort((a, b) => b.datetimeAt.getTime() - a.datetimeAt.getTime()) || [],
    };
  }, [incidentList, triggerList, medicationList, symptomList, days]);

  useEffect(() => {}, [filterData]);

  const handleSelectChange = (event: FormEvent) => {
    setTypeValue(event.target.value.toString());
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <ReceiptText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold dark:text-white">Most recent last {days} days</h2>
      </div>

      <div className="space-y-6 text-gray-900 dark:text-white">
        {existDataExport && (
          <>
            <div className="space-y-2">
              <select
                id="typeValue"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
                value={typeValue}
                onChange={handleSelectChange}
              >
                <option key="incidents" value="incidents">
                  Incidents
                </option>
                <option key="triggers" value="triggers">
                  Triggers
                </option>
                <option key="symptoms" value="symptoms">
                  Symptoms
                </option>
                <option key="medidications" value="medidications">
                  Medidications
                </option>
              </select>
            </div>
            {typeValue === 'incidents' && (
              <div className="space-y-2">
                <div className="flex items-center flex-col">
                  <span className="text-sm"> Incidents </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <table className="table-auto">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Start date time</th>
                            <th>Durations (in hours)</th>
                            <th>Triggers</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filterData.incidents.map(incident => (
                            <tr key={'incident-' + incident.id}>
                              <td className="text-left">{incident.type}</td>
                              <td className="text-center">
                                {getIsoDate(incident.startTime)} {getIsoTime(incident.startTime)}
                              </td>
                              <td className="text-center">{incident.durationHours}</td>
                              <td className="text-center">{incident.triggers.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {typeValue === 'triggers' && (
              <div className="space-y-2">
                <div className="flex items-center flex-col">
                  <span className="text-sm"> Triggers </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <table className="table-auto">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filterData.triggers.map(trigger => (
                            <tr key={'trigger-' + trigger.id}>
                              <td className="text-left">{trigger.type}</td>
                              <td className="text-center">
                                {getIsoDate(trigger.datetimeAt)} {getIsoTime(trigger.datetimeAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {typeValue === 'symptoms' && (
              <div className="space-y-2">
                <div className="flex items-center flex-col">
                  <span className="text-sm"> Symptoms </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <table className="table-auto">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Severity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filterData.symptoms.map(symptom => (
                            <tr key={'symptom-' + symptom.id}>
                              <td className="text-left">{symptom.type}</td>
                              <td className="text-center">
                                {getIsoDate(symptom.datetimeAt)} {getIsoTime(symptom.datetimeAt)}
                              </td>
                              <td className="text-center">{symptom.severity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {typeValue === 'medidications' && (
              <div className="space-y-2">
                <div className="flex items-center flex-col">
                  <span className="text-sm"> Medidications </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <table className="table-auto">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Dosage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filterData.medications.map(medication => (
                            <tr key={'medication-' + medication.id}>
                              <td className="text-left">{medication.title}</td>
                              <td className="text-center">
                                {getIsoDate(medication.datetimeAt)}{' '}
                                {getIsoTime(medication.datetimeAt)}
                              </td>
                              <td className="text-center">{medication.dosage}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
