import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Documentation() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documentation</h1>
          <p className="text-gray-600 dark:text-gray-300 dark:text-white"></p>
        </div>
        <section className="space-y-4 mt-5">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 dark:text-white">
              Welcome to The Migraine Tracker documentation! This guide will help you navigate the
              features and functionalities of our application, empowering you to take control of
              your migraine management.
            </p>
          </div>
        </section>
        <div className="space-y-8 mt-5">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Getting Started
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 dark:text-white">
                Upon creating your account, you'll be guided to set up your profile and configure
                your initial settings. This is crucial for tailoring The Migraine Tracker to your
                specific needs.
              </p>
            </div>
          </section>

          <section className="space-y-4 mt-5">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Key Features and How to Use Them:
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-x1 font-bold text-gray-800 dark:text-gray-200">
                <b>1. Profile Settings:</b>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Birthdate:</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Used to calculate your age and for biorhythm calculations.
                </li>
                <li>
                  <b>How to Modify:</b> Navigate to the "Profile"{' '}
                  <Link to="/profile" className="text-blue-500 dark:text-blue-500 underline">
                    section
                  </Link>{' '}
                  (usually accessible via an icon in the top right corner or a sidebar menu). You'll
                  find the "Birthdate" field where you can make changes. Click "Save" to update.
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Location Coordinates:</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Essential for accurate weather and solar activity data retrieval.
                </li>
                <li>
                  <b>How to Modify:</b> Similar to the birthdate, access the "Profile"{' '}
                  <Link to="/profile" className="text-blue-500 dark:text-blue-500 underline">
                    section
                  </Link>
                  . You can either manually enter your latitude and longitude or use the
                  "Auto-Detect" feature, which may require you to grant the application permission
                  to access your device's location. Remember to save your changes.
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Generate Encrypt Key (Featured)</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> This is a crucial feature for data security. It generates a unique
                  key used to encrypt your personal data, ensuring that only you can access it.
                </li>
                <li>
                  <b>How to Generate:</b>
                  Look for an option labeled "Setup Security" or something similar. Clicking this
                  will generate your unique key. Important: Store this key in a safe place, such as
                  a password manager. If you lose it, you will lose access to your encrypted data.
                  The application should provide a clear warning about this.
                </li>
              </ul>
            </div>
          </section>
          <section className="space-y-4 mt-5">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-x2 font-semibold text-gray-800 dark:text-gray-200">
                <b>2. Customization Options:</b>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                The Migraine Tracker allows you to personalize several aspects of your tracking
                experience:
              </p>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Trigger Types:</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Define the categories of potential triggers that are relevant to
                  you.
                </li>
                <li>
                  <b>How to Modify:</b> Usually found in a{' '}
                  <Link to="/settings" className="text-blue-500 dark:text-blue-500 underline">
                    "Settings"
                  </Link>{' '}
                  section. You should be able to add, edit, or delete trigger types. Examples:
                  "Food," "Stress," "Hormonal," etc. You can add sub-categories under each main
                  category (e.g., under "Food," you might add "Chocolate," "Caffeine," "Processed
                  Foods").
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Incident Types:</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Customize how you categorize different types of migraine events.
                </li>
                <li>
                  <b>How to Modify:</b> Similar to trigger types, you can manage incident types in
                  the{' '}
                  <Link to="/settings" className="text-blue-500 dark:text-blue-500 underline">
                    "Settings"
                  </Link>{' '}
                  section. Examples: "Migraine with Aura," "Migraine without Aura," "Cluster
                  Headache," etc.
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Medication List:</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Maintain a list of medications you use for migraine prevention or
                  treatment.
                </li>
                <li>
                  <b>How to Modify:</b> Likely found in a "Medications" or "Treatments" section
                  within{' '}
                  <Link to="/settings" className="text-blue-500 dark:text-blue-500 underline">
                    "Settings"
                  </Link>{' '}
                  You should be able to add new medications, edit existing ones (dosage, frequency),
                  or remove them.
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Symptoms List:</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Customize the list of symptoms you experience during migraine
                  episodes.
                </li>
                <li>
                  <b>How to Modify:</b> Look for a "Symptoms" section in{' '}
                  <Link to="/settings" className="text-blue-500 dark:text-blue-500 underline">
                    "Settings"
                  </Link>{' '}
                  You can add, edit, or delete symptoms. Examples: "Nausea," "Photophobia,"
                  "Phonophobia," "Throbbing Pain," etc.
                </li>
              </ul>
            </div>
          </section>
          <section className="space-y-4 mt-5">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-x1 font-bold text-gray-800 dark:text-gray-200">
                <b>3. Data Management:</b>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Import/Export (JSON):</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Allows you to import data from other sources or export your data
                  for backup or analysis in other applications.
                </li>
                <li>
                  <b>How to Use:</b> Typically located in a{' '}
                  <Link
                    to="/data-management"
                    className="text-blue-500 dark:text-blue-500 underline"
                  >
                    "Data Management"
                  </Link>{' '}
                  section.
                  <ol className="text-gray-600 dark:text-gray-300 dark:text-white mt-5 ml-5">
                    <li>
                      <b>Import:</b> Click "Import," select your JSON file, and follow the prompts
                      to map the data fields from your file to the corresponding fields in The
                      Migraine Tracker.
                    </li>
                    <li>
                      <b>Export:</b> Click "Export," and the application will generate a JSON file
                      containing your data. Save this file to your desired location.
                    </li>
                  </ol>
                </li>
                <li className="mt-5">
                  <b>JSON Schema:</b> The application should provide documentation on the specific
                  JSON schema it uses for import/export. This schema defines the structure and
                  format of the data. Located in a "Data Management" section
                </li>
                <li className="mt-5">
                  <b>Problem with data import:</b> The application should provide detailed
                  information about broken(not imported) items.
                </li>
              </ul>
            </div>
          </section>
          <section className="space-y-4 mt-5">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-x1 font-bold text-gray-800 dark:text-gray-200">
                <b>4. Data Visualization:</b>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">Dashboard</p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Provides a visual overview of your migraine data, including recent
                  incidents, tracked triggers, and other key metrics.
                </li>
                <li>
                  <b>How to Access:</b> The{' '}
                  <Link to="/dashboard" className="text-blue-500 dark:text-blue-500 underline">
                    "Dashboard"
                  </Link>{' '}
                  is usually the default view when you log in or can be accessed via the main menu.
                </li>
                <li>
                  <b>Features:</b> The dashboard will likely include:
                  <ol className="text-gray-600 dark:text-gray-300 dark:text-white mt-5 ml-5">
                    <li>
                      <b>Charts and Graphs:</b> Visual representations of your migraine patterns
                      over time. As calendar view. Your biorhythm charts.
                    </li>
                    <li>
                      <b>Recent Incidents:</b> (Featured) A summary of your most recent logged
                      migraines.
                    </li>
                    <li>
                      <b>Trigger Summary:</b> (Featured) An overview of the most frequently tracked
                      triggers.
                    </li>
                    <li>
                      <b>Weather info:</b> Current forecast and solar weather.
                    </li>
                    <li>
                      <b>Tracking buttons:</b> Fast way to add incidents, triggers, symptoms, or
                      mediactions.
                    </li>
                  </ol>
                </li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Report Page:</b>
              </p>
              <ul className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <li>
                  <b>Purpose:</b> Generate detailed reports on your migraine data for a specified
                  date range.
                </li>
                <li>
                  <b>How to Modify:</b> Look for a{' '}
                  <Link to="/report-page" className="text-blue-500 dark:text-blue-500 underline">
                    "Reports"
                  </Link>{' '}
                  section in the main menu.
                </li>
                <li>
                  <b>Features:</b>
                  <ol className="text-gray-600 dark:text-gray-300 dark:text-white mt-5 ml-5">
                    <li>
                      <b>Date Range Selection:</b> Choose the start and end dates for your report.
                    </li>
                    <li>
                      <b>Report Types:</b> The application may offer now all in one.
                      <ol className="text-gray-600 dark:text-gray-300 dark:text-white mt-5 ml-5">
                        <li>
                          <b>Migraine Summary:</b> (Featured) Overall statistics on the frequency,
                          duration, and severity of your migraines within the selected period.
                        </li>
                        <li>
                          <b>Trigger Analysis:</b> (Featured) A breakdown of the most common
                          triggers associated with your migraines.
                        </li>
                        <li>
                          <b>Symptom Report:</b> (Featured) Details on the symptoms you experienced
                          during the selected date range.
                        </li>
                        <li>
                          <b>Medication Effectiveness:</b> (Featured) If you log medication usage,
                          this report could analyze its effectiveness.
                        </li>
                        <li>
                          <b>Weather/Solar Correlation:</b> (Featured) If you log weather and solar
                          data, this may correlate with your incidents.
                        </li>
                      </ol>
                    </li>
                    <li>
                      <b>Export Options:</b> (Featured) You should be able to export reports in
                      various formats (PDF, CSV) for further analysis or to share with your
                      healthcare provider.
                    </li>
                  </ol>
                </li>
              </ul>
            </div>
          </section>
          <section className="space-y-4 mt-5">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-x1 font-bold text-gray-800 dark:text-gray-200">
                <b>Troubleshooting:</b>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5"></p>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Data Sync Issues:</b> If you're having trouble with data synchronization, ensure
                you have a stable internet connection. You might also try logging out and logging
                back in.
              </p>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Incorrect Weather Data:</b> Double-check that your location coordinates are
                accurate in your profile settings.
              </p>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                <b>Lost Encrypt Key:</b> If you lose your encryption key, you will permanently lose
                access to your encrypted data. There is no way to recover it.
              </p>
            </div>
          </section>
          <section className="space-y-4 mt-5">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-x1 font-bold text-gray-800 dark:text-gray-200">
                <b>Support:</b>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 dark:text-white mt-5">
                If you encounter any issues or have questions not covered in this documentation,
                please contact our support team at float45[at]gmail[dot]com
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
