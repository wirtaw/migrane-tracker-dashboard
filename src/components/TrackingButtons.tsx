import React, { useState } from 'react';
import { Variable } from 'lucide-react';
import AddButton from './AddButton';
import Modal from './Modal';
import SymptomForm from './forms/SymptomForm';
import MedicationForm from './forms/MedicationForm';
import IncidentForm from './forms/IncidentForm';
import WeightForm from './forms/WeightForm';
import HeightForm from './forms/HeightForm';
import BloodPressureForm from './forms/BloodPressureForm';
import TriggerForm from './forms/TriggerForm';
import { useProfileDataContext } from '../context/ProfileDataContext';

export default function TrackingButtons() {
  const { profileSettingsData, formErrorMessage, setFormErrorMessage } = useProfileDataContext();
  const [activeModal, setActiveModal] = useState<
    'symptom' | 'medication' | 'trigger' | 'incident' | 'weight' | 'height' | 'bloodPressure' | null
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
            <>
              <AddButton
                id="addSymptom"
                label="Quick record Weight"
                onClick={() => setActiveModal('weight')}
              />
              <AddButton
                id="recordBloodPressure"
                label="Quick record Blood pressure"
                onClick={() => setActiveModal('bloodPressure')}
              />
              <AddButton
                id="recordHeight"
                label="Quick record Height"
                onClick={() => setActiveModal('height')}
              />
            </>
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
        isOpen={activeModal === 'weight'}
        onClose={() => setActiveModal(null)}
        title="Manage Weight"
      >
        <WeightForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'height'}
        onClose={() => setActiveModal(null)}
        title="Manage Height"
      >
        <HeightForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'bloodPressure'}
        onClose={() => setActiveModal(null)}
        title="Manage Blood Pressure"
      >
        <BloodPressureForm onSubmit={() => setActiveModal(null)} />
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
