import React, { useState } from 'react';

import {
  IIncident,
  ITrigger,
  IMedication,
  ISymptom,
  ILocationData,
  IWeight,
  IHeight,
  IBloodPressure,
  ISleep,
  IWater,
} from '../../models/profileData.types';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import Loader from '../Loader';

interface IUploadDataFormProps {
  onSubmit: () => void;
}

import { validateImportData, IMaxIds } from '../../utils/dataValidation';

export default function UploadDataForm({ onSubmit }: IUploadDataFormProps) {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [warnMessage, setWarnMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newIncidents, setNewIncidents] = useState<IIncident[]>([]);
  const [newTriggers, setNewTriggers] = useState<ITrigger[]>([]);
  const [newMedications, setNewMedications] = useState<IMedication[]>([]);
  const [newSymptoms, setNewSymptoms] = useState<ISymptom[]>([]);
  const [newLocations, setNewLocations] = useState<ILocationData[]>([]);
  const [newWeights, setNewWeights] = useState<IWeight[]>([]);
  const [newHeights, setNewHeights] = useState<IHeight[]>([]);
  const [newBloodPressures, setNewBloodPressures] = useState<IBloodPressure[]>([]);
  const [newSleeps, setNewSleeps] = useState<ISleep[]>([]);
  const [newWaters, setNewWaters] = useState<IWater[]>([]);
  const {
    incidentList,
    setIncidentList,
    triggerList,
    setTriggerList,
    medicationList,
    setMedicationList,
    symptomList,
    setSymptomList,
    setBrokenImportData,
    medicationEnumList,
    setMedicationEnumList,
    triggerEnumList,
    setTriggerEnumList,
    symptomEnumList,
    setSymptomEnumList,
    locationList,
    setLocationList,
    weightList,
    heightList,
    bloodPressureList,
    sleepList,
    waterList,
    setWeightList,
    setHeightList,
    setBloodPressureList,
    setSleepList,
    setWaterList,
  } = useProfileDataContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) {
      setWarnMessage('No file selected');
      return;
    }

    const reader = new FileReader();

    reader.onloadstart = (): void => {
      setIsloading(true);
      setWarnMessage('');
      setErrorMessage('');
    };

    reader.onload = (e: ProgressEvent<FileReader>): void => {
      if (!e?.target?.result) {
        setErrorMessage('No file selected');
        return;
      }
      if (typeof e.target.result !== 'string') {
        setErrorMessage('File is not a string');
        return;
      }
      try {
        const data = JSON.parse(e.target.result);

        const maxIds: IMaxIds = {
          incidents: Math.max(0, ...incidentList.map(({ id }) => parseInt(id) || 0)),
          triggers: Math.max(0, ...triggerList.map(({ id }) => parseInt(id) || 0)),
          medications: Math.max(0, ...medicationList.map(({ id }) => parseInt(id) || 0)),
          symptoms: Math.max(0, ...symptomList.map(({ id }) => parseInt(id) || 0)),
          weights: Math.max(0, ...weightList.map(({ id }) => parseInt(id) || 0)),
          heights: Math.max(0, ...heightList.map(({ id }) => parseInt(id) || 0)),
          bloodPressures: Math.max(0, ...bloodPressureList.map(({ id }) => parseInt(id) || 0)),
          sleeps: Math.max(0, ...sleepList.map(({ id }) => parseInt(id) || 0)),
          waters: Math.max(0, ...waterList.map(({ id }) => parseInt(id) || 0)),
        };

        const { validData, brokenData } = validateImportData(data, maxIds);

        setNewIncidents(validData.incidents);
        setIncidentList([...incidentList, ...validData.incidents]);

        setNewTriggers(validData.triggers);
        setTriggerList([...triggerList, ...validData.triggers]);
        for (const trigger of validData.triggers) {
          if (!triggerEnumList.includes(trigger.type)) {
            setTriggerEnumList([...triggerEnumList, trigger.type]);
          }
        }

        setNewMedications(validData.medications);
        setMedicationList([...medicationList, ...validData.medications]);
        for (const medication of validData.medications) {
          if (!medicationEnumList.includes(medication.title)) {
            setMedicationEnumList([...medicationEnumList, medication.title]);
          }
        }

        setNewSymptoms(validData.symptoms);
        setSymptomList([...symptomList, ...validData.symptoms]);
        for (const symptom of validData.symptoms) {
          if (!symptomEnumList.includes(symptom.type)) {
            setSymptomEnumList([...symptomEnumList, symptom.type]);
          }
        }

        setNewLocations(validData.locations);
        setLocationList([...locationList, ...validData.locations]);

        setNewWeights(validData.healthLogs.weights);
        setWeightList([...weightList, ...validData.healthLogs.weights]);

        setNewHeights(validData.healthLogs.heights);
        setHeightList([...heightList, ...validData.healthLogs.heights]);

        setNewBloodPressures(validData.healthLogs.bloodPressures);
        setBloodPressureList([...bloodPressureList, ...validData.healthLogs.bloodPressures]);

        setNewSleeps(validData.healthLogs.sleeps);
        setSleepList([...sleepList, ...validData.healthLogs.sleeps]);

        setNewWaters(validData.healthLogs.waters);
        setWaterList([...waterList, ...validData.healthLogs.waters]);

        setIsFinished(true);
        setErrorMessage('');
        setWarnMessage('');

        setBrokenImportData({
          incidents: brokenData.incidents.length > 0 ? brokenData.incidents : null,
          triggers: brokenData.triggers.length > 0 ? brokenData.triggers : null,
          symptoms: brokenData.symptoms.length > 0 ? brokenData.symptoms : null,
          medications: brokenData.medications.length > 0 ? brokenData.medications : null,
          locations: brokenData.locations.length > 0 ? brokenData.locations : null,
          healthLogs: {
            weights:
              brokenData.healthLogs.weights.length > 0 ? brokenData.healthLogs.weights : null,
            heights:
              brokenData.healthLogs.heights.length > 0 ? brokenData.healthLogs.heights : null,
            bloodPressures:
              brokenData.healthLogs.bloodPressures.length > 0
                ? brokenData.healthLogs.bloodPressures
                : null,
            sleeps: brokenData.healthLogs.sleeps.length > 0 ? brokenData.healthLogs.sleeps : null,
            waters: brokenData.healthLogs.waters.length > 0 ? brokenData.healthLogs.waters : null,
          },
        });
      } catch (error: unknown) {
        setIsFinished(false);
        if (error instanceof Error) {
          setErrorMessage(`Error occurred process  ${error.message || ''}`);
        } else if (typeof error === 'string') {
          setErrorMessage(`Error occurred process  ${error || ''}`);
        } else {
          setErrorMessage('An unknown error occurred.'); // Generic error message if no message can be extracted.
          console.error('Unknown error:', error); // Log the full error for debugging
        }
      } finally {
        setIsloading(false);
      }
    };

    reader.onerror = (): void => {
      setIsFinished(false);
      setIsloading(false);
      setErrorMessage(`Error occurred reading file: ${file.name}`);
    };

    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="uploadButton"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Upload JSON file
        </label>
        <input
          type="file"
          id="uploadButton"
          onChange={e => handleFileChange(e)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 text-sm"
        />
      </div>

      <div className="relative p-6 flex-auto">
        {isLoading && <Loader />}

        {isFinished && warnMessage === '' && errorMessage === '' && (
          <div
            id="success-message"
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">File uploaded successfully.</span>
          </div>
        )}

        {warnMessage !== '' && (
          <div
            id="warning-message"
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Warning!</strong>
            <span className="block sm:inline">{warnMessage}</span>
          </div>
        )}

        {errorMessage !== '' && (
          <div
            id="error-message"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
      </div>

      <div className="text-gray-900 dark:text-white">
        {JSON.stringify([
          { type: 'Incidents', count: newIncidents.length },
          { type: 'Triggers', count: newTriggers.length },
          { type: 'Medications', count: newMedications.length },
          { type: 'Symptoms', count: newSymptoms.length },
          { type: 'Locations', count: newLocations.length },
          { type: 'Weight', count: newWeights.length },
          { type: 'Height', count: newHeights.length },
          { type: 'BloodPressure', count: newBloodPressures.length },
          { type: 'Water', count: newWaters.length },
          { type: 'Sleep', count: newSleeps.length },
        ])}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </form>
  );
}
