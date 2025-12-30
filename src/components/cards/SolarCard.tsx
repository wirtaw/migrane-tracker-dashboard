import React from 'react';
import { ISolar } from '../../models/profileData.types.ts';
import SolarChart from './../charts/SolarChart.tsx';

interface ISolarCardProps {
  solar: ISolar[] | [];
  className?: string;
}

export default function SolarCard({ solar, className }: ISolarCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;

  return (
    <>
      <h2 className="text-lg font-semibold dark:text-white">Solar charts</h2> <br />
      <div className={classNameJoined} style={{ width: '100%', height: 'auto' }}>
        <SolarChart solar={solar} />
      </div>
    </>
  );
}
