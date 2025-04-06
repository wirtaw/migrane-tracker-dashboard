import React from 'react';
import { useProfileDataContext } from '../../context/ProfileDataContext';

interface IResetUserDataFormProps {
  onSubmit: () => void;
}

export default function ResetUserDataForm({ onSubmit }: IResetUserDataFormProps) {
  const { setIncidentList, setTriggerList, setMedicationList, setSymptomList } =
    useProfileDataContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleReset = () => {
    setIncidentList([]);
    setTriggerList([]);
    setMedicationList([]);
    setSymptomList([]);

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          Do agree reset all incident, trigger, medication and symptom data?
        </p>
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Agree
        </button>

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
