import React, { useState } from 'react';
import { FolderKanban } from 'lucide-react';
import Modal from './../components/Modal';
import AddButton from './../components/AddButton';
import UploadIncidentsForm from './../components/forms/UploadIncidentsForm';

export default function DataManagement() {
  const [activeModal, setActiveModal] = useState<'uploadIncidents' | null>(null);

  return (
    <>
      <main className="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-6">
            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Management</h1>
          </div>

          <div className="space-y-12">
            <section className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Import JSON Data
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  Import JSON data into the application. The data will be stored in the
                  localstorage, encrypted with your key and can be accessed from the dashboard.
                  Format of the JSON data should be as follows:
                  <pre>
                    {JSON.stringify([
                      {
                        id: 1,
                        date: '2023-01-01',
                        description: 'Sample incident',
                        severity: 5,
                      },
                    ])}
                  </pre>
                </p>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Buttons</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  Click the button below to select a JSON file to import.
                </p>
                <AddButton
                  label="Upload Incidents"
                  onClick={() => setActiveModal('uploadIncidents')}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Modal
        isOpen={activeModal === 'uploadIncidents'}
        onClose={() => setActiveModal(null)}
        title="Upload Incidents"
      >
        <UploadIncidentsForm onSubmit={() => setActiveModal(null)} />
      </Modal>
    </>
  );
}
