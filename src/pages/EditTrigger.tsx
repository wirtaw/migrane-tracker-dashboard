import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfileDataContext } from '../context/ProfileDataContext';
import TriggerForm from '../components/forms/TriggerForm';
import { ITrigger } from '../models/profileData.types';

export default function EditTrigger() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerList } = useProfileDataContext();
  const [trigger, setTrigger] = useState<ITrigger | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && triggerList.length > 0) {
      const found = triggerList.find(t => t.id.toString() === id);
      if (found) {
        setTrigger(found);
      }
      setLoading(false);
    } else if (triggerList.length > 0) {
      setLoading(false);
    }
  }, [id, triggerList]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!trigger) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Trigger not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:text-indigo-500">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Trigger</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Update the details of your trigger record.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <TriggerForm initialData={trigger} onSubmit={() => navigate(-1)} />
      </div>
    </div>
  );
}
