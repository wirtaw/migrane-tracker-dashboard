import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import MedicationManageForm from './../components/forms/MedicationManageForm';
import SymptomTypeManageForm from '../components/forms/SymptomTypeManageForm';
import Modal from './../components/Modal';
import AddButton from './../components/AddButton';
import TriggerTypeManageForm from '../components/forms/TriggerTypeManageForm';

export default function Settings() {
  const [activeModal, setActiveModal] = useState<
    'symptom' | 'medication' | 'incident' | 'trigger' | null
  >(null);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
          </div>

          <div className="text-center mb-12">
            <section className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  Configure your application settings here.
                </p>
              </div>
            </section>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Medications
              </h2>
              <AddButton
                id="manageMedication"
                label="Manage Medications"
                onClick={() => setActiveModal('medication')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Symptoms
              </h2>
              <AddButton
                id="manageSyptomsTypes"
                label="Manage Symptoms"
                onClick={() => setActiveModal('symptom')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Incidents
              </h2>
              <AddButton
                id="manageIncidentsTypes"
                label="Manage Incidents"
                onClick={() => setActiveModal('incident')}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <h2 className="mt-4 mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                Potential Triggers
              </h2>
              <AddButton
                id="managePotentialTriggers"
                label="Manage Triggers"
                onClick={() => setActiveModal('trigger')}
              />
            </div>
          </div>
        </div>
      </main>
      <Modal
        isOpen={activeModal === 'medication'}
        onClose={() => setActiveModal(null)}
        title="Manage Medication"
      >
        <MedicationManageForm onSubmit={() => setActiveModal(null)} />
      </Modal>
      <Modal
        isOpen={activeModal === 'symptom'}
        onClose={() => setActiveModal(null)}
        title="Manage Symptoms"
      >
        <SymptomTypeManageForm />
      </Modal>

      <Modal
        isOpen={activeModal === 'trigger'}
        onClose={() => setActiveModal(null)}
        title="Manage Triggers"
      >
        <TriggerTypeManageForm />
      </Modal>
    </>
  );
}
