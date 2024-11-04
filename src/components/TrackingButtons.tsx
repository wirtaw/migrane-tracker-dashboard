import React, { useState } from 'react';
import AddButton from './AddButton';
import Modal from './Modal';
import SymptomForm from './forms/SymptomForm';
import MedicationForm from './forms/MedicationForm';
import IncidentForm from './forms/IncidentForm';

export default function TrackingButtons() {
  const [activeModal, setActiveModal] = useState<'symptom' | 'medication' | 'incident' | null>(null);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Track Health</h2>
        <div className="flex flex-col gap-3">
          <AddButton
            label="Add Symptom"
            onClick={() => setActiveModal('symptom')}
          />
          <AddButton
            label="Add Medication"
            onClick={() => setActiveModal('medication')}
          />
          <AddButton
            label="Record Incident"
            onClick={() => setActiveModal('incident')}
          />
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
        title="Add Medication"
      >
        <MedicationForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'incident'}
        onClose={() => setActiveModal(null)}
        title="Record Incident"
      >
        <IncidentForm onSubmit={() => setActiveModal(null)} />
      </Modal>
    </>
  );
}