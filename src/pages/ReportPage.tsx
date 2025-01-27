import React, { useState } from 'react';

import { useProfileDataContext } from '../context/ProfileDataContext.tsx';
import { getIsoDate } from '../lib/utils.ts';
import { FormEvent } from '../models/forms.types.ts';
import { Incident, Trigger, Medication, Symptom } from '../models/profileData.types.ts';

interface ReportPageData {
  date: string;
  incidents: Incident[];
  triggers: Trigger[];
  medications: Medication[];
  symptoms: Symptom[];
}

interface DataItem {
  datetimeAt: Date;
}

interface AddItemOptions {
  item: DataItem;
  type: keyof ReportPageData;
  data: { [date: string]: ReportPageData };
}

const addItem = ({ item, type, data }: AddItemOptions) => {
  const dt = getIsoDate(item.datetimeAt);
  if (!data[dt]) {
    data[dt] = {
      date: dt,
      incidents: [],
      triggers: [],
      medications: [],
      symptoms: [],
    };
  }
  (data[dt][type] as unknown[]).push(item);
};

const prepareReportData = ({
  startDate,
  endDate,
  incidentList,
  medicationList,
  triggerList,
  symptomList,
}: {
  startDate: Date;
  endDate: Date;
  incidentList: Incident[];
  medicationList: Medication[];
  triggerList: Trigger[];
  symptomList: Symptom[];
}): ReportPageData[] => {
  const data: { [date: string]: ReportPageData } = {};

  const filterByDate = (list: DataItem[]) =>
    list.filter(
      ({ datetimeAt }) =>
        (!startDate || datetimeAt >= startDate) && (!endDate || datetimeAt <= endDate)
    );

  filterByDate(incidentList).forEach(item => addItem({ item, type: 'incidents', data }));
  filterByDate(medicationList).forEach(item => addItem({ item, type: 'medications', data }));
  filterByDate(triggerList).forEach(item => addItem({ item, type: 'triggers', data }));
  filterByDate(symptomList).forEach(item => addItem({ item, type: 'symptoms', data }));

  return Object.values(data).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export default function ReportPage() {
  const dtNow: Date = new Date();
  const { incidentList, medicationList, triggerList, symptomList, profileSettingsData } =
    useProfileDataContext();
  const [startDate, setStartDate] = useState(new Date(dtNow.getTime() - 30 * 86400 * 1000));
  const [endDate, setEndDate] = useState(dtNow);
  const [filteredData, setFilteredData] = useState<ReportPageData[]>(
    prepareReportData({
      startDate,
      endDate,
      incidentList,
      medicationList,
      triggerList,
      symptomList,
    })
  );

  const handleStartDateChange = (event: FormEvent) => {
    if (new Date(event.target.value) < endDate) {
      setStartDate(new Date(event.target.value));
      setFilteredData(
        prepareReportData({
          startDate: new Date(event.target.value),
          endDate,
          incidentList,
          medicationList,
          triggerList,
          symptomList,
        })
      );
    }
  };

  const handleEndDateChange = (event: FormEvent) => {
    if (new Date(event.target.value) > startDate) {
      setEndDate(new Date(event.target.value));
      setFilteredData(
        prepareReportData({
          startDate,
          endDate: new Date(event.target.value),
          incidentList,
          medicationList,
          triggerList,
          symptomList,
        })
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Migraine Report</h1>
      <div className="mb-4">
        <label htmlFor="startDate" className="block mb-2 dark:text-white">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          className="border border-gray-400 px-2 py-1"
          value={getIsoDate(startDate)}
          onChange={handleStartDateChange}
          min={getIsoDate(new Date(profileSettingsData?.birthDate))}
          max={getIsoDate(new Date())}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="block mb-2 dark:text-white">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          className="border border-gray-400 px-2 py-1"
          value={getIsoDate(endDate)}
          onChange={handleEndDateChange}
          min={getIsoDate(new Date(profileSettingsData?.birthDate))}
          max={getIsoDate(new Date())}
        />
      </div>
      <div className="timeline relative border-l border-gray-300 dark:border-gray-700">
        {filteredData.map((item, index) => (
          <div key={index} className="timeline-item pb-8">
            <div className="timeline-date bg-gray-200 px-2 py-1 text-xs font-bold dark:bg-gray-800 dark:text-white">
              {item.date}
            </div>
            <div className="timeline-content pl-8 mt-4">
              {item.incidents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Incidents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {item.incidents.map((incident, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white"
                      >
                        <p>Type: {incident.type} </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {item.triggers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Triggers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {item.triggers.map((trigger, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white"
                      >
                        <p>Type: {trigger.type} </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {item.symptoms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Symptoms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {item.symptoms.map((symptom, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white"
                      >
                        <p>Type: {symptom.type} </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {item.medications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Medications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {item.medications.map((medication, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white"
                      >
                        <p>Type: {medication.title} </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
