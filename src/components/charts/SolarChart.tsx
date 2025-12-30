import React, { useEffect, useState, useMemo } from 'react';
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

import { ISolar } from '../../models/profileData.types.ts';
import ChartItem from './ChartItem.tsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ISolarChartProps {
  solar: ISolar[] | [];
}

type SolarChartKey = 'kIndex' | 'aIndex';

interface SolarChartConfig {
  label: string;
  borderColor: string;
  backgroundColor: string;
  yAxisID: 'y';
  tension: number;
}

const SOLAR_CHART_CONFIGS: Record<SolarChartKey, SolarChartConfig> = {
  kIndex: {
    label: 'K-index',
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    yAxisID: 'y',
    tension: 0.1,
  },
  aIndex: {
    label: 'A-index',
    borderColor: 'rgb(53, 162, 235)',
    backgroundColor: 'rgba(53, 162, 235, 0.5)',
    yAxisID: 'y',
    tension: 0.1,
  },
};

export default function SolarChart({ solar }: ISolarChartProps) {
  const [loading, setLoading] = useState(true);
  const [individualSolarChartData, setIndividualSolarChartData] = useState<Record<
    SolarChartKey,
    ChartData<'line'>
  > | null>(null);
  const [selectedSolarChart, setSelectedSolarChart] = useState<SolarChartKey>('kIndex');

  const getSolarChartOptions = useMemo(
    () =>
      (chartKey: SolarChartKey): ChartOptions<'line'> => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `${SOLAR_CHART_CONFIGS[chartKey].label} Solar Activity`,
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: SOLAR_CHART_CONFIGS[chartKey].label,
            },
          },
        },
      }),
    []
  );

  useEffect(() => {
    if (!solar || solar.length === 0) {
      setLoading(false);
      setIndividualSolarChartData(null);
      return;
    }

    const localLabels: string[] = [];
    const newIndividualSolarChartData: Record<SolarChartKey, ChartData<'line'>> = {} as Record<
      SolarChartKey,
      ChartData<'line'>
    >;

    for (const key in SOLAR_CHART_CONFIGS) {
      const solarChartKey = key as SolarChartKey;
      const config = SOLAR_CHART_CONFIGS[solarChartKey];
      newIndividualSolarChartData[solarChartKey] = {
        labels: [],
        datasets: [
          {
            label: config.label,
            data: [],
            borderColor: config.borderColor,
            backgroundColor: config.backgroundColor,
            yAxisID: config.yAxisID,
            tension: config.tension,
            fill: true,
          },
        ],
      };
    }

    for (const item of solar) {
      const dt = DateTime.fromISO(item.datetime);

      if (dt.isValid) {
        (newIndividualSolarChartData.kIndex.datasets[0].data as number[]).push(item?.kIndex || NaN);
        (newIndividualSolarChartData.aIndex.datasets[0].data as number[]).push(item?.aIndex || NaN);

        const formattedTime = dt.toFormat('DD T');
        if (!localLabels.includes(formattedTime)) {
          localLabels.push(formattedTime);
        }
      }
    }

    for (const key in newIndividualSolarChartData) {
      newIndividualSolarChartData[key as SolarChartKey].labels = localLabels;
    }

    setIndividualSolarChartData(newIndividualSolarChartData);
    setLoading(false);
  }, [solar]);

  return (
    <div className="space-y-4" style={{ width: '100%', height: 'auto' }}>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(SOLAR_CHART_CONFIGS).map(key => {
          const solarChartKey = key as SolarChartKey;
          return (
            <button
              key={solarChartKey}
              onClick={() => setSelectedSolarChart(solarChartKey)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${
                  selectedSolarChart === solarChartKey
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {SOLAR_CHART_CONFIGS[solarChartKey].label}
            </button>
          );
        })}
      </div>

      <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200 text-center">
        {SOLAR_CHART_CONFIGS[selectedSolarChart].label} Data
      </h3>

      {!loading && individualSolarChartData && individualSolarChartData[selectedSolarChart] ? (
        <ChartItem
          options={getSolarChartOptions(selectedSolarChart)}
          data={individualSolarChartData[selectedSolarChart]}
          className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200"
        />
      ) : (
        !loading && <p className="text-center text-gray-500">No data available for this chart.</p>
      )}
    </div>
  );
}
