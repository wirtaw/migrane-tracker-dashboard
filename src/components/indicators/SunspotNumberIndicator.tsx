import React from 'react';
import { Link } from 'react-router-dom';

export default function SunspotNumberIndicator({
  sunspotNumber,
}: {
  sunspotNumber: number | undefined;
}) {
  const getSunspotNumberColor = (sunspotNumber: number | undefined) => {
    if (!sunspotNumber) return '';
    if (sunspotNumber < 20) return 'bg-green-500';
    if (sunspotNumber <= 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSunspotNumberText = (sunspotNumber: number | undefined) => {
    if (!sunspotNumber) return '';
    if (sunspotNumber < 20) return 'Low';
    if (sunspotNumber <= 100) return 'Moderate';
    return 'High';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getSunspotNumberColor(sunspotNumber)}`} />
      <span className="text-sm font-medium dark:text-gray-300">
        {getSunspotNumberText(sunspotNumber)}
      </span>
      <Link
        to="/indicator-details#sunspot-number"
        className="ml-1 text-blue-500 hover:underline text-xs"
      >
        Details
      </Link>
    </div>
  );
}
