import React from 'react';
import { Link } from 'react-router-dom';

export default function UVIndexIndicator({
  uvi,
  showDetails = true,
}: {
  uvi: number | null;
  showDetails: boolean | null;
}) {
  const getUVIColor = (uvi: number | null) => {
    if (!uvi) return '';
    if (uvi <= 2) return 'bg-green-500';
    if (uvi <= 5) return 'bg-yellow-500';
    if (uvi <= 7) return 'bg-orange-500';
    if (uvi <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getUVIText = (uvi: number | null) => {
    if (!uvi) return '';
    if (uvi <= 2) return 'Low';
    if (uvi <= 5) return 'Moderate';
    if (uvi <= 7) return 'High';
    if (uvi <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getUVIColor(uvi)}`} />
      <span className="text-sm font-medium dark:text-gray-300">{getUVIText(uvi)}</span>
      {showDetails && (
        <Link
          to="/indicator-details#uv-index"
          className="ml-1 text-blue-500 hover:underline text-xs"
        >
          Details
        </Link>
      )}
    </div>
  );
}
