import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useParams, useLocation } from 'react-router-dom';
import { Info, UmbrellaIcon } from 'lucide-react';
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
import SolarCard from '../components/cards/SolarCard';
import UVIndexIndicator from '../components/indicators/UVIndexIndicator';
import SunspotNumberIndicator from '../components/indicators/SunspotNumberIndicator';
import SolarFluxIndicator from '../components/indicators/SolarFluxIndicator';
import OzoneIndicator from '../components/indicators/OzoneIndicator';

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
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dateValue = queryParams.get('date');
    const date = dateValue ? DateTime.fromISO(dateValue) : DateTime.now();
    setSelectedDate(date.isValid ? date : DateTime.now());

    let exists = 0;

    if (incidentList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setIncidentItems(
        incidentList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate())
      );
      exists++;
    }
    if (medicationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setMedicationItems(
        medicationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate())
      );
      exists++;
    }
    if (triggerList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setTriggerItems(triggerList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
      exists++;
    }
    if (symptomList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setSymptomItems(symptomList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()));
      exists++;
    }
    // TODO get in date raknge location data
    if (locationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate()).length) {
      setLocationItems(
        locationList.filter(item => getIsoDate(item.datetimeAt) === date.toISODate())
      );
      exists++;
    }

    setExists(exists !== 0);
  }, [date, location.search]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Date {selectedDate.toLocaleString()} Info
        </h1>
      </div>
      {exists && (
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
            <div className="lg:col-span-2 space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Location
                  </h2>
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {locationItems.map(location => (
                    <div key={'location-' + location.id} style={{ height: '110vh' }}>
                      <span>
                        Coordinates - {location.latitude} / {location.longitude}
                      </span>
                      <br />
                      {location.forecast && (
                        <ForecastCard
                          key={'location-' + location.id + '-forecast-card'}
                          forecast={location.forecast}
                        />
                      )}
                      <br />
                      {location.solar && (
                        <SolarCard
                          key={'location-' + location.id + '-solar-card'}
                          solar={location.solar}
                        />
                      )}
                      <br />
                      {location.solarRadiation && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
                              <UmbrellaIcon className="w-5 h-5 text-amber-500" />
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  UV Index
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-semibold dark:text-white">
                                    {location.solarRadiation[0]?.uviIndex}
                                  </span>
                                  <UVIndexIndicator
                                    uvi={location.solarRadiation[0]?.uviIndex || 0}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Ozone
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-semibold dark:text-white">
                                    {location.solarRadiation[0]?.ozone}
                                  </span>
                                  <OzoneIndicator ozone={location.solarRadiation[0]?.ozone || 0} />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Solar Flux
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-semibold dark:text-white">
                                    {location.solarRadiation[0]?.solarFlux}
                                  </span>
                                  <SolarFluxIndicator
                                    solarFlux={location.solarRadiation[0]?.solarFlux || 0}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg">
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Sunspot Number
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-semibold dark:text-white">
                                    {location.solarRadiation[0]?.sunsPotNumber}
                                  </span>
                                  <SunspotNumberIndicator
                                    sunspotNumber={location.solarRadiation[0]?.sunsPotNumber || 0}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
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
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Triggers
                  </h2>
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
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Symptoms
                  </h2>
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
      )}

      {!exists && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="space-y-8 pb-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                No items
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
