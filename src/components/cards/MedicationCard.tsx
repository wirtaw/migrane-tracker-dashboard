import React from 'react';

import { IMedication } from '../../models/profileData.types.ts';
import { getIsoDate, getIsoTime } from '../../lib/utils.ts';

interface IMedicationCardProps {
  medication: IMedication;
  className?: string;
}

export default function MedicationCard({ medication, className }: IMedicationCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;
  return (
    <div className={classNameJoined}>
      <div className="space-y-2">
        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">
          {medication.title}
        </h3>
        <p className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200">
          Time - {getIsoDate(medication.datetimeAt)} {getIsoTime(medication.datetimeAt)} <br />
          Dosage - {medication.dosage} <br />
        </p>
      </div>
    </div>
  );
}
