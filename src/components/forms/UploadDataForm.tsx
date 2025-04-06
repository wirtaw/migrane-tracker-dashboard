import React, { useState } from 'react';
import sjcl, { SjclCipherEncrypted } from 'sjcl';
import {
  IIncident,
  ITrigger,
  IMedication,
  ISymptom,
  IBrokenTrigger,
  IBrokenIncident,
  IBrokenMedication,
  IBrokenSymptom,
  ILocationData,
  IBrokenLocation,
} from '../../models/profileData.types';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import Loader from '../Loader';

interface IUploadDataFormProps {
  onSubmit: () => void;
  decode: boolean;
}

const decrypt = (data: string | SjclCipherEncrypted, key: string) => {
  return JSON.parse(sjcl.decrypt(key, data));
};

const brokenIncidents: IBrokenIncident[] = [];
const brokenTriggers: IBrokenTrigger[] = [];
const brokenMedications: IBrokenMedication[] = [];
const brokenSymptoms: IBrokenSymptom[] = [];
const brokenLocations: IBrokenLocation[] = [];

const mapIncidentList = (jsonDataIncidents: unknown, maxId: number): IIncident[] | [] => {
  if (!jsonDataIncidents || !Array.isArray(jsonDataIncidents)) {
    return [];
  }
  const incidents: IIncident[] = [];
  for (const incident of jsonDataIncidents) {
    const { id, userId, datetimeAt, type, startTime, durationHours, triggers, notes, createdAt } =
      incident;

    if (!userId) {
      brokenIncidents.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
        durationHours,
        triggers,
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        notes: notes || '',
        warning: 'Incident missing userId',
      });
      continue;
    }

    if (!datetimeAt) {
      brokenIncidents.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
        durationHours,
        triggers,
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        notes: notes || '',
        warning: 'Incident missing datetimeAt',
      });
      continue;
    }

    if (!type) {
      brokenIncidents.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
        durationHours,
        triggers,
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        notes: notes || '',
        warning: 'Incident missing type',
      });
      continue;
    }

    if (!startTime) {
      brokenIncidents.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
        durationHours,
        triggers,
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        notes: notes || '',
        warning: 'Incident missing startTime',
      });
      continue;
    }

    if (!durationHours) {
      brokenIncidents.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
        durationHours,
        triggers,
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        notes: notes || '',
        warning: 'Incident missing durationHours',
      });
      continue;
    }

    if (triggers && !Array.isArray(triggers)) {
      brokenIncidents.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
        durationHours,
        triggers,
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        notes: notes || '',
        warning: 'Incident triggers is not an array',
      });
      continue;
    }

    const setId = id || maxId + 1;

    incidents.push({
      id: setId,
      userId: userId.toString(),
      datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
      type,
      startTime: typeof startTime === 'string' ? new Date(startTime) : startTime,
      durationHours,
      triggers,
      createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
      notes: notes || '',
    });

    if (setId > maxId) {
      maxId = setId;
    }
  }

  return incidents;
};

const mapTriggerList = (jsonDataTriggers: unknown, maxId: number): ITrigger[] | [] => {
  if (!jsonDataTriggers || !Array.isArray(jsonDataTriggers)) {
    return [];
  }
  const triggers: ITrigger[] = [];
  for (const trigger of jsonDataTriggers) {
    const { id, userId, datetimeAt, type, note, createdAt } = trigger;

    if (!userId) {
      brokenTriggers.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        note: note || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        warning: 'Trigger missing userId',
      });
      continue;
    }

    if (!datetimeAt) {
      brokenTriggers.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        note: note || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        warning: 'Trigger missing datetimeAt',
      });
      continue;
    }

    if (!type) {
      brokenTriggers.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        note: note || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        warning: 'Trigger missing type',
      });
      continue;
    }

    const setId = id || maxId + 1;

    triggers.push({
      id: setId,
      userId: userId.toString(),
      datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
      type,
      note: note || '',
      createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
    });

    if (setId > maxId) {
      maxId = setId;
    }
  }

  return triggers;
};

const mapMedicationList = (jsonDataMedications: unknown, maxId: number): IMedication[] | [] => {
  if (!jsonDataMedications || !Array.isArray(jsonDataMedications)) {
    return [];
  }
  const medications: IMedication[] = [];
  for (const medication of jsonDataMedications) {
    const { id, userId, datetimeAt, title, dosage, notes, createdAt, updateAt } = medication;

    if (!userId) {
      brokenMedications.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        title,
        dosage,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        updateAt: typeof updateAt === 'string' ? new Date(updateAt) : new Date(),
        warning: 'Medication missing userId',
      });
      continue;
    }

    if (!datetimeAt) {
      brokenMedications.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        title,
        dosage,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        updateAt: typeof updateAt === 'string' ? new Date(updateAt) : new Date(),
        warning: 'Medication missing datetimeAt',
      });
      continue;
    }

    if (!title) {
      brokenMedications.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        title,
        dosage,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        updateAt: typeof updateAt === 'string' ? new Date(updateAt) : new Date(),
        warning: 'Medication missing title',
      });
      continue;
    }

    if (!dosage) {
      brokenMedications.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        title,
        dosage,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        updateAt: typeof updateAt === 'string' ? new Date(updateAt) : new Date(),
        warning: 'Medication missing dosage',
      });
      continue;
    }

    const setId = id || maxId + 1;

    medications.push({
      id: setId,
      userId: userId.toString(),
      datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
      title,
      dosage,
      notes: notes || '',
      createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
      updateAt: typeof updateAt === 'string' ? new Date(updateAt) : new Date(),
    });

    if (setId > maxId) {
      maxId = setId;
    }
  }

  return medications;
};

const mapSymptomList = (jsonDataSymptoms: unknown, maxId: number): ISymptom[] | [] => {
  if (!jsonDataSymptoms || !Array.isArray(jsonDataSymptoms)) {
    return [];
  }
  const symptoms: ISymptom[] = [];
  for (const symptom of jsonDataSymptoms) {
    const { id, userId, datetimeAt, type, severity, notes, createdAt } = symptom;

    if (!userId) {
      brokenSymptoms.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        severity,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        warning: 'Symptom missing userId',
      });
      continue;
    }

    if (!datetimeAt) {
      brokenSymptoms.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        severity,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        warning: 'Symptom missing datetimeAt',
      });
      continue;
    }

    if (!type) {
      brokenSymptoms.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        severity,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        warning: 'Symptom missing type',
      });
      continue;
    }

    if (!severity) {
      brokenSymptoms.push({
        id: 0,
        userId: userId.toString(),
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        type,
        severity,
        notes: notes || '',
        createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
        warning: 'Symptom missing severity',
      });
      continue;
    }

    const setId = id || maxId + 1;

    symptoms.push({
      id: setId,
      userId: userId.toString(),
      datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
      type,
      severity,
      notes: notes || '',
      createdAt: typeof createdAt === 'string' ? new Date(createdAt) : new Date(),
    });

    if (setId > maxId) {
      maxId = setId;
    }
  }

  return symptoms;
};

const mapLocationList = (jsonDataLogsForecast: unknown, maxId: number): ILocationData[] | [] => {
  if (!jsonDataLogsForecast || !Array.isArray(jsonDataLogsForecast)) {
    return [];
  }
  const locations: ILocationData[] = [];
  for (const location of jsonDataLogsForecast) {
    const {
      id,
      userId,
      datetimeAt,
      incidentId,
      solarRadiation,
      solar,
      forecast,
      longitude,
      latitude,
    } = location;

    if (!userId) {
      brokenLocations.push({
        id: 0,
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId,
        solarRadiation,
        forecast,
        solar,
        warning: 'Location missing userId',
      });
      continue;
    }

    if (!datetimeAt) {
      brokenLocations.push({
        id: 0,
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId,
        solarRadiation,
        forecast,
        solar,
        warning: 'Location missing datetimeAt',
      });
      continue;
    }

    if (!longitude) {
      brokenLocations.push({
        id: 0,
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId,
        solarRadiation,
        forecast,
        solar,
        warning: 'Location missing longitude',
      });
      continue;
    }

    if (!latitude) {
      brokenLocations.push({
        id: 0,
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId,
        solarRadiation,
        forecast,
        solar,
        warning: 'Location missing latitude',
      });
      continue;
    }

    if (!forecast || !Array.isArray(forecast)) {
      brokenLocations.push({
        id: 0,
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId,
        solarRadiation,
        forecast,
        solar,
        warning: 'Location missing forecast',
      });
      continue;
    }

    if (!solarRadiation || !Array.isArray(solarRadiation)) {
      brokenLocations.push({
        id: 0,
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId,
        solarRadiation,
        forecast,
        solar,
        warning: 'Location missing solarRadiation',
      });
      continue;
    }

    if (!solar || !Array.isArray(solar)) {
      brokenLocations.push({
        id: 0,
        userId: userId.toString(),
        longitude,
        latitude,
        datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
        incidentId,
        solarRadiation,
        forecast,
        solar,
        warning: 'Location missing solar',
      });
      continue;
    }

    const setId = id || maxId + 1;

    locations.push({
      id: setId,
      userId: userId.toString(),
      longitude,
      latitude,
      datetimeAt: typeof datetimeAt === 'string' ? new Date(datetimeAt) : datetimeAt,
      incidentId,
      solarRadiation,
      forecast,
      solar,
    });

    if (setId > maxId) {
      maxId = setId;
    }
  }

  return locations;
};

export default function UploadDataForm({ onSubmit, decode }: IUploadDataFormProps) {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [warnMessage, setWarnMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newIncidents, setNewIncidents] = useState<IIncident[]>([]);
  const [newTriggers, setNewTriggers] = useState<ITrigger[]>([]);
  const [newMedications, setNewMedications] = useState<IMedication[]>([]);
  const [newSymptoms, setNewSymptoms] = useState<ISymptom[]>([]);
  const [newLocations, setNewLocations] = useState<ILocationData[]>([]);
  const {
    incidentList,
    setIncidentList,
    triggerList,
    setTriggerList,
    medicationList,
    setMedicationList,
    symptomList,
    setSymptomList,
    profileSecurityData,
    setBrokenImportData,
    medicationEnumList,
    setMedicationEnumList,
    triggerEnumList,
    setTriggerEnumList,
    symptomEnumList,
    setSymptomEnumList,
    locationList,
    setLocationList,
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
        let data;
        if (decode && profileSecurityData?.key) {
          const decoded: string = decrypt(e.target.result, profileSecurityData?.key);
          if (!decoded) {
            setErrorMessage('File is not base64 encoded');
            return;
          }
          data = JSON.parse(decoded);
        } else {
          data = JSON.parse(e.target.result);
        }
        const {
          incidents: jsonDataIncidents,
          triggers: jsonDataTriggers,
          medications: jsonDataMedications,
          symptoms: jsonDataSymptoms,
          logsForecast: jsonDataLogsForecast,
        } = data;

        // Incidents
        let maxId = Math.max(...incidentList.map(({ id }) => id));
        const incidents: IIncident[] = mapIncidentList(jsonDataIncidents, maxId);

        setNewIncidents(incidents);
        setIncidentList([...incidentList, ...incidents]);

        // Triggers
        maxId = Math.max(...triggerList.map(({ id }) => id));
        const triggers: ITrigger[] = mapTriggerList(jsonDataTriggers, maxId);

        setNewTriggers(triggers);
        setTriggerList([...triggerList, ...triggers]);
        for (const trigger of triggers) {
          if (!triggerEnumList.includes(trigger.type)) {
            setTriggerEnumList([...triggerEnumList, trigger.type]);
          }
        }

        // Medications
        maxId = Math.max(...medicationList.map(({ id }) => id));
        const medications: IMedication[] = mapMedicationList(jsonDataMedications, maxId);

        setNewMedications(medications);
        setMedicationList([...medicationList, ...medications]);
        for (const medication of medications) {
          if (!medicationEnumList.includes(medication.title)) {
            setMedicationEnumList([...medicationEnumList, medication.title]);
          }
        }

        // Symptoms
        maxId = Math.max(...symptomList.map(({ id }) => id));
        const symptoms: ISymptom[] = mapSymptomList(jsonDataSymptoms, maxId);

        setNewSymptoms(symptoms);
        setSymptomList([...symptomList, ...symptoms]);
        for (const symptom of symptoms) {
          if (!symptomEnumList.includes(symptom.type)) {
            setSymptomEnumList([...symptomEnumList, symptom.type]);
          }
        }

        // Locations
        maxId = Math.max(...locationList.map(({ id }) => id));
        const locations: ILocationData[] = mapLocationList(jsonDataLogsForecast, maxId);

        setNewLocations(locations);
        setLocationList([...locationList, ...locations]);

        setIsFinished(true);
        setErrorMessage('');
        setWarnMessage('');

        setBrokenImportData({
          incidents: brokenIncidents.length > 0 ? brokenIncidents : null,
          triggers: brokenTriggers.length > 0 ? brokenTriggers : null,
          symptoms: brokenSymptoms.length > 0 ? brokenSymptoms : null,
          medications: brokenMedications.length > 0 ? brokenMedications : null,
          locations: brokenLocations.length > 0 ? brokenLocations : null,
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
