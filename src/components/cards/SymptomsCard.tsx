import React from 'react';

import { ISymptom } from '../../models/profileData.types.ts';
import { getIsoDate, getIsoTime } from '../../lib/utils.ts';

interface ISymptomCardProps {
  symptom: ISymptom;
  className?: string;
}

export default function SymptomCard({ symptom, className }: ISymptomCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;
  return (
    <div className={classNameJoined}>
      <div className="space-y-2">
        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">
          {symptom.type}
        </h3>
        <p className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200">
          Time - {getIsoDate(symptom.datetimeAt)} {getIsoTime(symptom.datetimeAt)} <br />
          Severity - {symptom.severity} <br />
        </p>
      </div>
    </div>
  );
}
