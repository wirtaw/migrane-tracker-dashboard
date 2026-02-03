import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileDataContext } from '../context/ProfileDataContext';
import HealthLogsForm from '../components/forms/HealthLogsForm';
import { IHeight, IWeight, IBloodPressure } from '../models/profileData.types';

export default function EditHealthLog() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { weightList, heightList, bloodPressureList } = useProfileDataContext();

  const [logData, setLogData] = useState<IHeight | IWeight | IBloodPressure | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type && id) {
      let found: IHeight | IWeight | IBloodPressure | undefined = undefined;
      if (type === 'weight') {
        found = weightList.find(w => w.id === id);
      } else if (type === 'height') {
        found = heightList.find(h => h.id === id);
      } else if (type === 'bloodPressure') {
        found = bloodPressureList.find(bp => bp.id === id);
      }

      if (found) {
        setLogData(found);
      }
      setLoading(false);
    }
  }, [type, id, weightList, heightList, bloodPressureList]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!logData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Health log not found
        </h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:text-indigo-500">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
          Edit {type} Log
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Update your health log entry.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <HealthLogsForm
          initialType={type as 'height' | 'weight' | 'bloodPressure'}
          initialData={logData}
          onSubmit={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
