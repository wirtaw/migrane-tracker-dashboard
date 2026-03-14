import { useState, useEffect } from 'react';
import { FolderKanban } from 'lucide-react';
import Modal from './../components/Modal';
import AddButton from './../components/AddButton';
import MinusButton from './../components/MinusButton';
import UploadDataForm from './../components/forms/UploadDataForm';
import DownloadDataForm from '../components/forms/DownloadDataForm';
import ResetUserDataForm from '../components/forms/ResetUserDataForm';
import DatabaseUploadForm from '../components/forms/DatabaseUploadForm';
import DatabaseBackupForm from '../components/forms/DatabaseBackupForm';
import DatabaseCleanForm from '../components/forms/DatabaseCleanForm';
import { useProfileDataContext } from '../context/ProfileDataContext';

export default function DataManagement() {
  const [activeModal, setActiveModal] = useState<
    'uploadJSON' | 'exportJSON' | 'resetData' | 'uploadDB' | 'backupDB' | 'cleanDB' | null
  >(null);

  const [hasBrokenImportData, setHasBrokenImportData] = useState<boolean>(false);
  const [hasUserData, setHasUserData] = useState<boolean>(false);
  const {
    brokenImportData,
    incidentList,
    triggerList,
    medicationList,
    symptomList,
    locationList,
    weightList,
    heightList,
    bloodPressureList,
    sleepList,
    waterList,
  } = useProfileDataContext();

  useEffect(() => {
    const hasBrokenData =
      (brokenImportData &&
        Array.isArray(brokenImportData.incidents) &&
        brokenImportData.incidents.length > 0) ||
      (Array.isArray(brokenImportData.triggers) && brokenImportData.triggers.length > 0) ||
      (Array.isArray(brokenImportData.medications) && brokenImportData.medications.length > 0) ||
      (Array.isArray(brokenImportData.symptoms) && brokenImportData.symptoms.length > 0);

    const hasData =
      (incidentList && incidentList.length > 0) ||
      (triggerList && triggerList.length > 0) ||
      (medicationList && medicationList.length > 0) ||
      (symptomList && symptomList.length > 0) ||
      (locationList && locationList.length > 0) ||
      (weightList && weightList.length > 0) ||
      (heightList && heightList.length > 0) ||
      (bloodPressureList && bloodPressureList.length > 0) ||
      (sleepList && sleepList.length > 0) ||
      (waterList && waterList.length > 0);
    setHasUserData(hasData);
    setHasBrokenImportData(hasBrokenData);
  }, [
    brokenImportData,
    incidentList,
    triggerList,
    medicationList,
    symptomList,
    locationList,
    weightList,
    heightList,
    bloodPressureList,
    sleepList,
    waterList,
  ]);

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
                </p>
                <details className="text-gray-600 dark:text-gray-300">
                  <pre className="bg-gray-100 p-4 rounded-md text-black">
                    {JSON.stringify(
                      {
                        type: 'object',
                        properties: {
                          incidents: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'number' },
                                userId: { type: 'string' },
                                datetimeAt: { type: 'string', format: 'date-time' },
                                type: { type: 'string' },
                                startTime: { type: 'string', format: 'date-time' },
                                durationHours: { type: 'number' },
                                triggers: {
                                  type: 'array',
                                  items: { type: 'string' },
                                },
                                notes: { type: 'string' },
                                createdAt: { type: 'string', format: 'date-time' },
                              },
                              required: [
                                'userId',
                                'datetimeAt',
                                'type',
                                'startTime',
                                'durationHours',
                              ],
                            },
                          },
                          triggers: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'number' },
                                userId: { type: 'string' },
                                datetimeAt: { type: 'string', format: 'date-time' },
                                type: { type: 'string' },
                                note: { type: 'string' },
                                createdAt: { type: 'string', format: 'date-time' },
                              },
                              required: ['userId', 'datetimeAt', 'type'],
                            },
                          },
                          medications: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'number' },
                                userId: { type: 'string' },
                                datetimeAt: { type: 'string', format: 'date-time' },
                                title: { type: 'string' },
                                dosage: { type: 'string' },
                                notes: { type: 'string' },
                                createdAt: { type: 'string', format: 'date-time' },
                                updateAt: { type: 'string', format: 'date-time' },
                              },
                              required: ['userId', 'datetimeAt', 'title', 'dosage'],
                            },
                          },
                          symptoms: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'number' },
                                userId: { type: 'string' },
                                datetimeAt: { type: 'string', format: 'date-time' },
                                type: { type: 'string' },
                                severity: { type: 'number' },
                                notes: { type: 'string' },
                                createdAt: { type: 'string', format: 'date-time' },
                              },
                              required: ['userId', 'datetimeAt', 'type', 'severity'],
                            },
                          },
                        },
                        required: ['incidents', 'triggers', 'medications', 'symptoms'],
                      },
                      null,
                      2
                    )}
                  </pre>
                </details>
              </div>
            </section>
            {hasBrokenImportData && (
              <section className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="bg-yellow-100 border border-yellow-400 text-yellow-700">
                    Import JSON data have some items are broken. Broken items be as follows:
                  </p>
                  <details className="text-gray-600 dark:text-gray-300">
                    <pre className="bg-gray-100 p-4 rounded-md text-black">
                      {JSON.stringify(brokenImportData, null, 2)}
                    </pre>
                  </details>
                </div>
              </section>
            )}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Storage Management
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mt-5">
                    <label htmlFor="uploadJSON" className="text-gray-600 dark:text-gray-300">
                      <AddButton
                        id="uploadJSON"
                        label="Upload JSON File"
                        onClick={() => setActiveModal('uploadJSON')}
                      />
                      <span className="text-gray-700 dark:text-gray-300 mt-5">
                        Import a JSON file to local storage.
                      </span>
                    </label>
                  </div>
                </div>

                {hasUserData && (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="mt-5">
                      <label htmlFor="exportJSON" className="text-gray-600 dark:text-gray-300">
                        <AddButton
                          id="exportJSON"
                          label="Export JSON File"
                          onClick={() => setActiveModal('exportJSON')}
                        />
                        <span className="text-gray-700 dark:text-gray-300 mt-5">
                          Export your local storage data to JSON.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {hasUserData && (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="mt-5">
                      <label htmlFor="resetData" className="text-gray-600 dark:text-gray-300">
                        <MinusButton
                          id="resetData"
                          label="Reset user data"
                          onClick={() => setActiveModal('resetData')}
                        />
                        <span className="text-red-700 dark:text-red-300 mt-5">
                          Reset all imported/modified data (local storage).{' '}
                          <span className="font-bold">Danger zone</span>
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Database Management
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your data stored in the remote database. These actions affect your synced
                  account data.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mt-5">
                    <label htmlFor="uploadDB" className="text-gray-600 dark:text-gray-300">
                      <AddButton
                        id="uploadDB"
                        label="Upload to Database"
                        onClick={() => setActiveModal('uploadDB')}
                      />
                      <span className="text-gray-700 dark:text-gray-300 mt-5">
                        Upload a JSON file directly to the remote database.
                      </span>
                    </label>
                  </div>
                </div>

                {hasUserData && (
                  <>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="mt-5">
                        <label htmlFor="backupDB" className="text-gray-600 dark:text-gray-300">
                          <AddButton
                            id="backupDB"
                            label="Backup Database"
                            onClick={() => setActiveModal('backupDB')}
                          />
                          <span className="text-gray-700 dark:text-gray-300 mt-5">
                            Download a full backup of all your data from the remote database.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                      <div className="mt-5">
                        <label htmlFor="cleanDB" className="text-gray-600 dark:text-gray-300">
                          <MinusButton
                            id="cleanDB"
                            label="Clean Database"
                            onClick={() => setActiveModal('cleanDB')}
                          />
                          <span className="text-red-700 dark:text-red-300 mt-5">
                            Permanently delete ALL data from the remote database.{' '}
                            <span className="font-bold">Highly Dangerous!</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Modal
        isOpen={activeModal === 'uploadJSON'}
        onClose={() => setActiveModal(null)}
        title="Upload JSON Data"
      >
        <UploadDataForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'uploadDB'}
        onClose={() => setActiveModal(null)}
        title="Upload to Database"
      >
        <DatabaseUploadForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'exportJSON'}
        onClose={() => setActiveModal(null)}
        title="Export JSON Data"
      >
        <DownloadDataForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'resetData'}
        onClose={() => setActiveModal(null)}
        title="Reset user data"
      >
        <ResetUserDataForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'backupDB'}
        onClose={() => setActiveModal(null)}
        title="Backup Database Data"
      >
        <DatabaseBackupForm onSubmit={() => setActiveModal(null)} />
      </Modal>

      <Modal
        isOpen={activeModal === 'cleanDB'}
        onClose={() => setActiveModal(null)}
        title="Clean Database (DANGEROUS)"
      >
        <DatabaseCleanForm onSubmit={() => setActiveModal(null)} />
      </Modal>
    </>
  );
}
