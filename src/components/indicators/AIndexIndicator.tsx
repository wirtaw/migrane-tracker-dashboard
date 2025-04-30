import React from 'react';
import { Link } from 'react-router-dom';

export default function AIndexIndicator({
  aIndex,
  showDetails = true,
}: {
  aIndex: number | undefined;
  showDetails: boolean | undefined;
}) {
  const getAIndexColor = (aIndex: number | undefined) => {
    if (!aIndex) return '';
    if (aIndex <= 7) return 'bg-green-500';
    if (aIndex <= 15) return 'bg-yellow-500';
    if (aIndex <= 29) return 'bg-orange-500';
    if (aIndex <= 49) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getAIndexText = (aIndex: number | undefined) => {
    if (!aIndex) return '';
    if (aIndex <= 7) return 'Quiet';
    if (aIndex <= 15) return 'Unsettled';
    if (aIndex <= 29) return 'Active';
    if (aIndex <= 49) return 'Minor Storm';
    return 'Major Storm';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getAIndexColor(aIndex)}`} />
      <span className="text-sm font-medium dark:text-gray-300">{getAIndexText(aIndex)}</span>
      {showDetails && (
        <Link
          to="/indicator-details#a-index"
          className="ml-1 text-blue-500 hover:underline text-xs"
        >
          Details
        </Link>
      )}
    </div>
  );
}
