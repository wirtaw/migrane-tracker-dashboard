import React from 'react';
import { Link } from 'react-router-dom';

export default function OzoneIndicator({ ozone }: { ozone: number | undefined }) {
  const getOzoneColor = (ozone: number | undefined) => {
    if (!ozone) return '';
    if (ozone < 200) return 'bg-green-500';
    if (ozone <= 300) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getOzoneText = (ozone: number | undefined) => {
    if (!ozone) return '';
    if (ozone < 200) return 'Low';
    if (ozone <= 300) return 'Moderate';
    return 'High';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getOzoneColor(ozone)}`} />
      <span className="text-sm font-medium dark:text-gray-300">{getOzoneText(ozone)}</span>
      <Link to="/indicator-details#ozone" className="ml-1 text-blue-500 hover:underline text-xs">
        Details
      </Link>
    </div>
  );
}
