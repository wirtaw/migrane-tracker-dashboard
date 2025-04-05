import React from 'react';

import { IIncident } from '../../models/profileData.types';
import { getIsoDate, getIsoTime } from '../../lib/utils.ts';

interface IIncidentCardProps {
  incident: IIncident;
  className?: string;
}

export default function IncidentCard({ incident, className }: IIncidentCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;
  return (
    <div className={classNameJoined}>
      <div className="space-y-2">
        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">
          {incident.type}
        </h3>
        <p className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200">
          Time - {getIsoDate(incident.startTime)} {getIsoTime(incident.startTime)} <br />
          Duration - {incident.durationHours}h <br />
          Triggers - '{incident.triggers.join(', ')}'
        </p>
      </div>
    </div>
  );
}
