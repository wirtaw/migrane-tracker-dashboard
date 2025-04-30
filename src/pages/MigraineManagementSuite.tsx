import React from 'react';
import { Info, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useProfileDataContext } from '../context/ProfileDataContext';

export default function MigraineManagementSuite() {
  const tablePhrase = '(see table on the reverse side)';
  const { recommendationList, reducedTyramineMenuList } = useProfileDataContext();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // -1 goes back one step in the history
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Migraine Management Suite
        </h1>

        <div className="space-y-8">
          <button onClick={goBack} className="inline-block mt-4 text-blue-500 hover:underline">
            Back
          </button>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Recommendations for Lifestyle Changes to Prevent Migraine Attacks
              </h2>
            </div>
            <ol className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              {recommendationList.map((recommendation, index) => (
                <li key={'recommendation-item-' + index}>
                  {recommendation.replace(tablePhrase, '')}
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {' '}
                Diet with Reduced Tyramine Content for Migraine Patients (Based on S. Diamond, 1997)
              </h2>
            </div>
            <table
              id="diet"
              className="table-auto text-gray-800 dark:text-gray-200 border-collapse border border-gray-400"
            >
              <thead>
                <tr>
                  <th className="text-center border-spacing-2 border border-gray-300 p-2">
                    Food Products
                  </th>
                  <th className="text-center border-spacing-2 border border-gray-300 p-2">
                    Allowed Use
                  </th>
                  <th className="text-center border-spacing-2 border border-gray-300 p-2">
                    Limited (Cautious) Use
                  </th>
                  <th className="text-center border-spacing-2 border border-gray-300 p-2">
                    Strictly Prohibited Use
                  </th>
                </tr>
              </thead>
              <tbody>
                {reducedTyramineMenuList.map((item, index) => (
                  <tr key={'tyramin-menu-item-' + index}>
                    <td className="text-left border-spacing-2 border border-gray-300 p-2">
                      {item.product}
                    </td>
                    <td className="text-center border-spacing-2 border border-gray-300 p-2">
                      {item.allowedUse}
                    </td>
                    <td className="text-center border-spacing-2 border border-gray-300 p-2">
                      {item.limitedUse}
                    </td>
                    <td className="text-center border-spacing-2 border border-gray-300 p-2">
                      {item.striclyProhibitedUse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="space-y-8">
          <button onClick={goBack} className="inline-block mt-4 text-blue-500 hover:underline">
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
