import React, { useEffect, useState, useMemo } from 'react';
import sjcl, { SjclCipherEncrypted } from 'sjcl';
import {
  Incident,
  Trigger,
  Medication,
  Symptom,
  LocationData,
} from '../../models/profileData.types';
import { useProfileDataContext } from '../../context/ProfileDataContext';
import Loader from '../Loader';
import { useAuth } from '../../context/AuthContext.tsx';

interface DownloadDataFormProps {
  onSubmit: () => void;
  decode: boolean;
}

interface ExportJSON {
  incidents: Incident[];
  triggers: Trigger[];
  medications: Medication[];
  symptoms: Symptom[];
  locationData: LocationData[];
}

const encrypt = (data: string | SjclCipherEncrypted, key: string) => {
  return JSON.stringify(sjcl.encrypt(key, JSON.stringify(data)));
};

export default function DownloadDataForm({ onSubmit, decode }: DownloadDataFormProps) {
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [warnMessage, setWarnMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [existDataExport, setExistDataExport] = useState<boolean>(false);
  const [exportString, setExportString] = useState<string>('');
  const { incidentList, triggerList, medicationList, symptomList, profileSecurityData } =
    useProfileDataContext();
  const { locationDataList } = useAuth();

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
      symptomList.length > 0 &&
      Array.isArray(locationDataList) &&
      locationDataList.length > 0;

    setExistDataExport(hasData);
  }, [incidentList, triggerList, medicationList, symptomList, locationDataList]);

  const exportData = useMemo<ExportJSON>(() => {
    if (!existDataExport) {
      setIsFinished(false);
      setIsloading(false);
      setWarnMessage(`Empty export data`);
      return { incidents: [], triggers: [], medications: [], symptoms: [], locationData: [] };
    }

    return {
      incidents: incidentList || [],
      triggers: triggerList || [],
      medications: medicationList || [],
      symptoms: symptomList || [],
      locationData: locationDataList || [],
    };
  }, [incidentList, triggerList, medicationList, symptomList, locationDataList, existDataExport]);

  useEffect(() => {
    const jsonString =
      decode && profileSecurityData?.key
        ? encrypt(JSON.stringify(exportData), profileSecurityData.key)
        : JSON.stringify(exportData, null, 2);
    setExportString(jsonString);
    setWarnMessage('');
  }, [exportData, decode, profileSecurityData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleDownload = () => {
    setIsloading(true);
    if (!exportString) {
      setIsFinished(false);
      setIsloading(false);
      setWarnMessage(`Empty export data`);
      return;
    }
    const dt = new Date();

    try {
      const base64String = btoa(exportString);
      const filename = `${profileSecurityData.userId}-migraine-tracker-export-${dt.getTime()}.json`;
      const link = document.createElement('a');
      link.href = `data:application/json;base64,${base64String}`;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsFinished(true);
      setErrorMessage('');
      setWarnMessage('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(`Error during download ${error.message || ''}. Please try again.`);
      } else if (typeof error === 'string') {
        setErrorMessage(`Error during download ${error || ''}. Please try again.`);
      } else {
        setErrorMessage('An unknown error occurred.'); // Generic error message if no message can be extracted.
        console.error('Unknown error:', error); // Log the full error for debugging
      }

      setIsFinished(false);
      setIsloading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="download"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Download JSON file
        </label>
        <div className="text-gray-900 dark:text-white hidden">
          exists {existDataExport.toString()} / decode {decode.toString()} / key{' '}
          {profileSecurityData?.key}
        </div>
        <details className="text-gray-600 dark:text-gray-300 mt-5">
          <pre className="bg-gray-100 p-4 rounded-md text-black">{exportString}</pre>
        </details>
        {errorMessage === '' && warnMessage === '' && (
          <button
            onClick={handleDownload}
            disabled={!exportString && !existDataExport}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5"
          >
            Download JSON
          </button>
        )}
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
