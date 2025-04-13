import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Disc2 } from 'lucide-react';

import { useProfileDataContext } from '../context/ProfileDataContext';

interface IIndexedRecommendations {
  id: number;
  item: string;
}

const shuffle = (array: IIndexedRecommendations[], factor: number = 0.5) => {
  const indexes = array.map(({ id }) => +id).sort(() => Math.random() - factor);

  return indexes.map(i => array[i - 1]);
};

export default function MigrainePreventionTip() {
  const { recommendationList } = useProfileDataContext();

  const [recommendation, setRecommendation] = useState<string>('');

  useEffect(() => {
    const indexedRecommendations: IIndexedRecommendations[] = recommendationList.map(
      (item, index) => ({
        id: index,
        item,
      })
    );

    const randomRecommendationList: IIndexedRecommendations[] = shuffle(
      indexedRecommendations,
      0.5
    );

    setRecommendation(randomRecommendationList[0].item);
  }, [recommendationList]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Disc2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold dark:text-white"></h2>
      </div>

      <div className="space-y-6 text-gray-900 dark:text-white">{recommendation}</div>

      <div className="flex justify-between pt-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Full list recommendation page:{' '}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <Link
            to={`/migraine-management-suite`}
            className="text-blue-800 dark:text-blue-400 hover:text-blue-700 hover:text-underline"
          >
            Full information
          </Link>
        </div>
      </div>
    </div>
  );
}
