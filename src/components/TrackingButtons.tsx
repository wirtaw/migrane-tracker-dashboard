import { useState } from 'react';
import { Variable, Activity } from 'lucide-react';
import AddButton from './AddButton';
import Modal from './Modal';
import SymptomForm from './forms/SymptomForm';
import MedicationForm from './forms/MedicationForm';
import IncidentForm from './forms/IncidentForm';
import HealthLogsForm from './forms/HealthLogsForm';
import TriggerForm from './forms/TriggerForm';
import { useProfileDataContext } from '../context/ProfileDataContext';
import { useAuth } from '../context/AuthContext';

export default function TrackingButtons() {
  const { profileSettingsData } = useAuth();
  const { formErrorMessage, setFormErrorMessage } = useProfileDataContext();
  const [activeModal, setActiveModal] = useState<
    'symptom' | 'medication' | 'trigger' | 'incident' | 'healthLogs' | null
  >(null);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Variable className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold dark:text-white">Track Health</h2>
        </div>
        <div className="flex flex-col gap-3">
          <AddButton
            id="addSymptom"
            label="Quick record Symptom"
            onClick={() => setActiveModal('symptom')}
          />
          <AddButton
            id="addMedication"
            label="Quick record Medication"
            onClick={() => setActiveModal('medication')}
          />
          <AddButton
            id="addTrigger"
            label="Quick record Trigger"
            onClick={() => setActiveModal('trigger')}
          />
          <AddButton
            id="recordIcident"
            label="Quick record Incident"
            onClick={() => setActiveModal('incident')}
          />
          {profileSettingsData?.personalHealthData && (
            <AddButton
              id="recordHealthLogs"
              label="Log Health Data"
              onClick={() => setActiveModal('healthLogs')}
              icon={<Activity className="w-4 h-4 mr-2" />}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={activeModal === 'symptom'}
        onClose={() => setActiveModal(null)}
        title="Track Symptom"
      >
        <SymptomForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'medication'}
        onClose={() => setActiveModal(null)}
        title="Record Medication"
      >
        <MedicationForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'trigger'}
        onClose={() => setActiveModal(null)}
        title="Record Trigger"
      >
        <TriggerForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'incident'}
        onClose={() => setActiveModal(null)}
        title="Record Incident"
      >
        <IncidentForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'healthLogs'}
        onClose={() => setActiveModal(null)}
        title="Track Health Metrics"
      >
        <HealthLogsForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={formErrorMessage.showModal === true}
        onClose={() => setFormErrorMessage({ showModal: false, message: '' })}
        title="Error message"
      >
        <div className="text-red-500 text-sm mt-1 dark:text-white">
          <p>{formErrorMessage.message}</p>
        </div>
      </Modal>
    </>
  );
}
