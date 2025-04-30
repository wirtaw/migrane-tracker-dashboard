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

import { IForecast } from '../../models/profileData.types.ts';
import { IsNumber } from '../../lib/utils.ts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IForecastCardProps {
  forecast: IForecast[] | [];
  className?: string;
}

export default function ForecastCard({ forecast, className }: IForecastCardProps) {
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
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  });
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<ChartData<'line'>>({
    labels,
    datasets: [
      {
        label: 'temperature',
        data: [0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
        tension: 0.1,
      },
      {
        label: 'pressure',
        data: [0],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
        tension: 1,
      },
      {
        label: 'humidity',
        data: [0],
        borderColor: 'rgb(37, 148, 9)',
        backgroundColor: 'rgba(37, 148, 9, 0.5)',
        yAxisID: 'y',
        tension: 1,
      },
      {
        label: 'windSpeed',
        data: [0],
        borderColor: 'rgb(216, 196, 19)',
        backgroundColor: 'rgba(216, 196, 19, 0.5)',
        yAxisID: 'y',
        tension: 0.1,
      },
      {
        label: 'clouds',
        data: [0],
        borderColor: 'rgb(90, 90, 90)',
        backgroundColor: 'rgba(90, 90, 90, 0.5)',
        yAxisID: 'y',
        tension: 1,
      },
      {
        label: 'uvi',
        data: [0],
        borderColor: 'rgb(202, 15, 108)',
        backgroundColor: 'rgba(202, 15, 108, 0.5)',
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
    localData.datasets[2].data = [];
    localData.datasets[3].data = [];
    localData.datasets[4].data = [];
    localData.datasets[5].data = [];

    for (const item of forecast) {
      const dt = DateTime.fromISO(item.datetime);
      let hasValue: boolean = false;

      if (dt.isValid) {
        hasValue = false;

        if (IsNumber(item?.temperature)) {
          localData.datasets[0].data.push(item.temperature);
          hasValue = true;
        }

        if (IsNumber(item?.pressure)) {
          localData.datasets[1].data.push(item.pressure);
          hasValue = true;
        }

        if (IsNumber(item?.humidity)) {
          localData.datasets[2].data.push(item.humidity);
          hasValue = true;
        }

        if (IsNumber(item?.windSpeed)) {
          localData.datasets[3].data.push(item.windSpeed);
          hasValue = true;
        }

        if (IsNumber(item?.clouds)) {
          localData.datasets[4].data.push(item.clouds);
          hasValue = true;
        }

        if (IsNumber(item?.uvi)) {
          localData.datasets[5].data.push(item.uvi);
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
  }, [forecast]);

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
