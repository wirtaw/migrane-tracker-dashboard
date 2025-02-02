import React, { useState } from 'react';
import sjcl, { SjclCipherEncrypted } from 'sjcl';
import { Incident, Trigger, Medication, Symptom } from '../../models/profileData.types';
import { useProfileDataContext } from '../../context/ProfileDataContext';

interface UploadDataFormProps {
  onSubmit: () => void;
  decode: boolean;
}

const decrypt = (data: string | SjclCipherEncrypted, key: string) => {
  return JSON.parse(sjcl.decrypt(key, data));
};

const mapIncidentList = (jsonDataIncidents: unknown, maxId: number): Incident[] | [] => {
  if (!jsonDataIncidents || !Array.isArray(jsonDataIncidents)) {
    return [];
  }
  const incidents: Incident[] = [];
  for (const incident of jsonDataIncidents) {
    const { id, userId, datetimeAt, type, startTime, durationHours, triggers, notes, createdAt } =
      incident;

    if (!userId) {
      console.log('Incident missing userId');
      continue;
    }

    if (!datetimeAt) {
      console.log('Incident missing datetimeAt');
      continue;
    }

    if (!type) {
      console.log('Incident missing type');
      continue;
    }

    if (!startTime) {
      console.log('Incident missing startTime');
      continue;
    }

    if (!durationHours) {
      console.log('Incident missing durationHours');
      continue;
    }

    if (triggers && !Array.isArray(triggers)) {
      console.log('Incident triggers is not an array');
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

const mapTriggerList = (jsonDataTriggers: unknown, maxId: number): Trigger[] | [] => {
  if (!jsonDataTriggers || !Array.isArray(jsonDataTriggers)) {
    return [];
  }
  const triggers: Trigger[] = [];
  for (const trigger of jsonDataTriggers) {
    const { id, userId, datetimeAt, type, note, createdAt } = trigger;

    if (!userId) {
      console.log('Trigger missing userId');
      continue;
    }

    if (!datetimeAt) {
      console.log('Trigger missing datetimeAt');
      continue;
    }

    if (!type) {
      console.log('Trigger missing type');
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

const mapMedicationList = (jsonDataMedications: unknown, maxId: number): Medication[] | [] => {
  if (!jsonDataMedications || !Array.isArray(jsonDataMedications)) {
    return [];
  }
  const medications: Medication[] = [];
  for (const medication of jsonDataMedications) {
    const { id, userId, datetimeAt, title, dosage, notes, createdAt, updateAt } = medication;

    if (!userId) {
      console.log('Medication missing userId');
      continue;
    }

    if (!datetimeAt) {
      console.log('Medication missing datetimeAt');
      continue;
    }

    if (!title) {
      console.log('Medication missing title');
      continue;
    }

    if (!dosage) {
      console.log('Medication missing dosage');
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

const mapSymptomList = (jsonDataSymptoms: unknown, maxId: number): Symptom[] | [] => {
  if (!jsonDataSymptoms || !Array.isArray(jsonDataSymptoms)) {
    return [];
  }
  const symptoms: Symptom[] = [];
  for (const symptom of jsonDataSymptoms) {
    const { id, userId, datetimeAt, type, severity, notes, createdAt } = symptom;

    if (!userId) {
      console.log('Symptom missing userId');
      continue;
    }

    if (!datetimeAt) {
      console.log('Symptom missing datetimeAt');
      continue;
    }

    if (!type) {
      console.log('Symptom missing type');
      continue;
    }

    if (!severity) {
      console.log('Symptom missing severity');
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

export default function UploadDataForm({ onSubmit, decode }: UploadDataFormProps) {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [warnMessage, setWarnMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newIncidents, setNewIncidents] = useState<Incident[]>([]);
  const [newTriggers, setNewTriggers] = useState<Trigger[]>([]);
  const [newMedications, setNewMedications] = useState<Medication[]>([]);
  const [newSymptoms, setNewSymptoms] = useState<Symptom[]>([]);
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
        } = data;

        // Incidents
        let maxId = Math.max(...incidentList.map(({ id }) => id));
        const incidents: Incident[] = mapIncidentList(jsonDataIncidents, maxId);

        setNewIncidents(incidents);
        setIncidentList([...incidentList, ...incidents]);

        // Triggers
        maxId = Math.max(...triggerList.map(({ id }) => id));
        const triggers: Trigger[] = mapTriggerList(jsonDataTriggers, maxId);

        setNewTriggers(triggers);
        setTriggerList([...triggerList, ...triggers]);

        // Medications
        maxId = Math.max(...medicationList.map(({ id }) => id));
        const medications: Medication[] = mapMedicationList(jsonDataMedications, maxId);

        setNewMedications(medications);
        setMedicationList([...medicationList, ...medications]);

        // Symptoms
        maxId = Math.max(...symptomList.map(({ id }) => id));
        const symptoms: Symptom[] = mapSymptomList(jsonDataSymptoms, maxId);

        setNewSymptoms(symptoms);
        setSymptomList([...symptomList, ...symptoms]);
        setIsFinished(true);
        setErrorMessage('');
        setWarnMessage('');
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
        {isLoading && <div>Loading</div>}

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
