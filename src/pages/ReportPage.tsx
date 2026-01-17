import React, { useState } from 'react';

import { useProfileDataContext } from '../context/ProfileDataContext';
import { getIsoDate, getIsoTime } from '../lib/utils';
import { IFormEvent } from '../models/forms.types';
import { IIncident, ITrigger, IMedication, ISymptom } from '../models/profileData.types';
import { useAuth } from '../context/AuthContext';
import { fetchIncidentStats } from '../services/incidents';
import { IncidentStats } from '../models/stats.types';
import { IncidentStatsCharts } from '../components/charts/IncidentStatsCharts';
import Loader from '../components/Loader';

interface IReportPageData {
  date: string;
  incidents: IIncident[];
  triggers: ITrigger[];
  medications: IMedication[];
  symptoms: ISymptom[];
}

interface IDataItem {
  datetimeAt: Date;
}

interface IAddItemOptions {
  item: IDataItem;
  type: keyof IReportPageData;
  data: { [date: string]: IReportPageData };
}

const addItem = ({ item, type, data }: IAddItemOptions) => {
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
  incidentList: IIncident[];
  medicationList: IMedication[];
  triggerList: ITrigger[];
  symptomList: ISymptom[];
}): IReportPageData[] => {
  const data: { [date: string]: IReportPageData } = {};

  const filterByDate = (list: IDataItem[]) =>
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
  const { incidentList, medicationList, triggerList, symptomList } = useProfileDataContext();
  const { profileSettingsData, apiSession } = useAuth();
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats'>('timeline');
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [startDate, setStartDate] = useState(new Date(dtNow.getTime() - 30 * 86400 * 1000));
  const [endDate, setEndDate] = useState(dtNow);
  const [filteredData, setFilteredData] = useState<IReportPageData[]>(
    prepareReportData({
      startDate,
      endDate,
      incidentList,
      medicationList,
      triggerList,
      symptomList,
    })
  );

  const handleStartDateChange = (event: IFormEvent) => {
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

  const handleEndDateChange = (event: IFormEvent) => {
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

  const loadStats = async () => {
    if (!apiSession?.accessToken || stats) return;
    setLoadingStats(true);
    try {
      const data = await fetchIncidentStats(apiSession.accessToken);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleTabChange = (tab: 'timeline' | 'stats') => {
    setActiveTab(tab);
    if (tab === 'stats') {
      loadStats();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Migraine Report</h1>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'timeline'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => handleTabChange('timeline')}
        >
          Timeline
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'stats'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => handleTabChange('stats')}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'timeline' ? (
        <>
          <div className="mb-4">
            <label htmlFor="startDate" className="block mb-2 dark:text-white">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              className="border border-gray-400 px-2 py-1 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              className="border border-gray-400 px-2 py-1 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.incidents.map((incident, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white border-r-4 border-red-500"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Incident Details</h3>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Type:</strong> {incident.type}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Start Time:</strong> {getIsoTime(incident.startTime)}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Duration:</strong> {incident.durationHours} hours
                            </p>
                            {incident.notes && (
                              <p className="text-gray-600 dark:text-gray-300">
                                <strong>Notes:</strong> {incident.notes}
                              </p>
                            )}
                            {incident.triggers.length > 0 && (
                              <div>
                                <p className="text-gray-600 dark:text-gray-300">
                                  <strong>Triggers:</strong>
                                </p>
                                <ul className="list-disc list-inside">
                                  {incident.triggers.map((trigger, index) => (
                                    <li key={index} className="text-gray-600 dark:text-gray-300">
                                      {trigger}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.triggers.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {item.triggers.map((trigger, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white border-r-4 border-yellow-500"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Trigger Details</h3>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Type:</strong> {trigger.type}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Start Time:</strong> {getIsoTime(trigger.datetimeAt)}
                            </p>
                            {trigger.note && (
                              <p className="text-gray-600 dark:text-gray-300">
                                <strong>Notes:</strong> {trigger.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.symptoms.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {item.symptoms.map((symptom, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white border-r-4 border-green-500"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Symptom Details</h3>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Type:</strong> {symptom.type}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Start Time:</strong> {getIsoTime(symptom.createdAt)}
                            </p>
                            {symptom.note && (
                              <p className="text-gray-600 dark:text-gray-300">
                                <strong>Notes:</strong> {symptom.note}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.medications.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                      {item.medications.map((medication, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md dark:text-white border-r-4 border-blue-500"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Medication Details</h3>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Title:</strong> {medication.title}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Start Time:</strong> {getIsoTime(medication.datetimeAt)}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              <strong>Dosage:</strong> {medication.dosage}
                            </p>
                            {medication.notes && (
                              <p className="text-gray-600 dark:text-gray-300">
                                <strong>Notes:</strong> {medication.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="stats-container">
          {loadingStats ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : stats ? (
            <IncidentStatsCharts stats={stats} />
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Failed to load statistics. Please try again later.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
