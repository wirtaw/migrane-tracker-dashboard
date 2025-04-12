import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { ISolar } from '../../models/profileData.types.ts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ISolarCardProps {
  solar: ISolar[] | [];
  className?: string;
}

export default function SolarCard({ solar, className }: ISolarCardProps) {
  const classNameJoined = `flex gap-4 rounded-xl shadow-sm p-6 border-2 ${className || ''}`;
  const [loading, setLoading] = useState(true);
  const [options] = useState<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Forecast',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
    },
  });
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<ChartData<'line'>>({
    labels,
    datasets: [
      {
        label: 'kIndex',
        data: [0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
        tension: 0.1,
      },
      {
        label: 'aIndex',
        data: [0],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const localLabels: string[] = [];
    const localData: ChartData<'line'> = { ...data };
    localData.datasets[0].data = [];
    localData.datasets[1].data = [];

    for (const item of solar) {
      const dt = DateTime.fromISO(item.datetime);
      let hasValue: boolean = false;

      if (dt.isValid) {
        hasValue = false;

        if (item?.kIndex) {
          localData.datasets[0].data.push(item.kIndex);
          hasValue = true;
        }

        if (item?.aIndex) {
          localData.datasets[1].data.push(item.aIndex);
          hasValue = true;
        }

        if (hasValue && !localLabels.includes(dt.toFormat('DD T'))) {
          localLabels.push(dt.toFormat('DD T'));
        }
      }
    }

    setLabels(localLabels);
    localData.labels = localLabels;
    setData(localData);
    setLoading(false);
  }, [solar]);

  return (
    <div className={classNameJoined} style={{ width: '100%', height: 'auto' }}>
      <div className="space-y-2" style={{ width: '100%', height: 'auto' }}>
        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200"></h3>
        {!loading && (
          <Line
            options={options}
            data={data}
            className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200"
          />
        )}
      </div>
    </div>
  );
}
