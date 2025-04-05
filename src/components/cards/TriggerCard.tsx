import React from 'react';

import { ITrigger } from '../../models/profileData.types.ts';
import { getIsoDate, getIsoTime } from '../../lib/utils.ts';

interface ITriggerCardProps {
  trigger: ITrigger;
  className?: string;
}

export default function TriggerCard({ trigger, className }: ITriggerCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;
  return (
    <div className={classNameJoined}>
      <div className="space-y-2">
        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">
          {trigger.type}
        </h3>
        <p className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200">
          Time - {getIsoDate(trigger.datetimeAt)} {getIsoTime(trigger.datetimeAt)} <br />
        </p>
      </div>
    </div>
  );
}
