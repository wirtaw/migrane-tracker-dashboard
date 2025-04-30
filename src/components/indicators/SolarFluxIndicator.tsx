import React from 'react';
import { Link } from 'react-router-dom';

export default function SolarFluxIndicator({ solarFlux }: { solarFlux: number | undefined }) {
  const getSolarFluxColor = (solarFlux: number | undefined) => {
    if (!solarFlux) return '';
    if (solarFlux < 80) return 'bg-green-500';
    if (solarFlux <= 150) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSolarFluxText = (solarFlux: number | undefined) => {
    if (!solarFlux) return '';
    if (solarFlux < 80) return 'Low Activity';
    if (solarFlux <= 150) return 'Moderate Activity';
    return 'High Activity';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getSolarFluxColor(solarFlux)}`} />
      <span className="text-sm font-medium dark:text-gray-300">{getSolarFluxText(solarFlux)}</span>
      <Link
        to="/indicator-details#solar-flux"
        className="ml-1 text-blue-500 hover:underline text-xs"
      >
        Details
      </Link>
    </div>
  );
}
