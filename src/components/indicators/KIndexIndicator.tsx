import React from 'react';
import { Link } from 'react-router-dom';

export default function KIndexIndicator({
  kIndex,
  showDetails = true,
}: {
  kIndex: number | undefined;
  showDetails: boolean | undefined;
}) {
  const getKIndexColor = (kIndex: number | undefined) => {
    if (!kIndex) return '';
    if (kIndex <= 2) return 'bg-green-500';
    if (kIndex <= 3) return 'bg-yellow-500';
    if (kIndex <= 4) return 'bg-orange-500';
    if (kIndex <= 5) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getKIndexText = (kIndex: number | undefined) => {
    if (!kIndex) return '';
    if (kIndex <= 2) return 'Quiet';
    if (kIndex <= 3) return 'Unsettled';
    if (kIndex <= 4) return 'Minor Storm';
    if (kIndex <= 5) return 'Moderate Storm';
    return 'Strong Storm';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getKIndexColor(kIndex)}`} />
      <span className="text-sm font-medium dark:text-gray-300">{getKIndexText(kIndex)}</span>
      {showDetails && (
        <Link
          to="/indicator-details#k-index"
          className="ml-1 text-blue-500 hover:underline text-xs"
        >
          Details
        </Link>
      )}
    </div>
  );
}
