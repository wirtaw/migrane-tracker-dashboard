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

import { IForecast } from '../../models/profileData.types.ts';
import { IsNumber } from '../../lib/utils.ts';
import ChartItem from './ChartItem.tsx'; // Adjust the import path as needed

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IForecastChartProps {
  forecast: IForecast[] | [];
}

type ForecastChartKey = 'temperature' | 'pressure' | 'humidity' | 'windSpeed' | 'clouds' | 'uvi';

interface ChartConfig {
  label: string;
  borderColor: string;
  backgroundColor: string;
  yAxisID: 'y' | 'y1';
  tension: number;
}

const CHART_CONFIGS: Record<ForecastChartKey, ChartConfig> = {
  temperature: {
    label: 'Temperature',
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    yAxisID: 'y',
    tension: 0.1,
  },
  pressure: {
    label: 'Pressure',
    borderColor: 'rgb(53, 162, 235)',
    backgroundColor: 'rgba(53, 162, 235, 0.5)',
    yAxisID: 'y1',
    tension: 1,
  },
  humidity: {
    label: 'Humidity',
    borderColor: 'rgb(37, 148, 9)',
    backgroundColor: 'rgba(37, 148, 9, 0.5)',
    yAxisID: 'y',
    tension: 1,
  },
  windSpeed: {
    label: 'Wind Speed',
    borderColor: 'rgb(216, 196, 19)',
    backgroundColor: 'rgba(216, 196, 19, 0.5)',
    yAxisID: 'y',
    tension: 0.1,
  },
  clouds: {
    label: 'Clouds',
    borderColor: 'rgb(90, 90, 90)',
    backgroundColor: 'rgba(90, 90, 90, 0.5)',
    yAxisID: 'y',
    tension: 1,
  },
  uvi: {
    label: 'UVI',
    borderColor: 'rgb(202, 15, 108)',
    backgroundColor: 'rgba(202, 15, 108, 0.5)',
    yAxisID: 'y',
    tension: 0.1,
  },
};

export default function ForecastChart({ forecast }: IForecastChartProps) {
  const [loading, setLoading] = useState(true);
  const [individualChartData, setIndividualChartData] = useState<Record<
    ForecastChartKey,
    ChartData<'line'>
  > | null>(null);
  const [selectedChart, setSelectedChart] = useState<ForecastChartKey>('temperature'); // Default to temperature

  const getChartOptions = useMemo(
    () =>
      (chartKey: ForecastChartKey): ChartOptions<'line'> => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `${CHART_CONFIGS[chartKey].label} Forecast`,
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: CHART_CONFIGS[chartKey].label,
            },
          },
          y1: {
            type: 'linear',
            display: CHART_CONFIGS[chartKey].yAxisID === 'y1',
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: CHART_CONFIGS[chartKey].yAxisID === 'y1',
              text: CHART_CONFIGS[chartKey].label, // Y1-axis label
            },
          },
        },
      }),
    []
  );

  useEffect(() => {
    if (!forecast || forecast.length === 0) {
      setLoading(false);
      setIndividualChartData(null);
      return;
    }

    const localLabels: string[] = [];
    const newIndividualChartData: Record<ForecastChartKey, ChartData<'line'>> = {} as Record<
      ForecastChartKey,
      ChartData<'line'>
    >;

    for (const key in CHART_CONFIGS) {
      const chartKey = key as ForecastChartKey;
      const config = CHART_CONFIGS[chartKey];
      newIndividualChartData[chartKey] = {
        labels: [],
        datasets: [
          {
            label: config.label,
            data: [],
            borderColor: config.borderColor,
            backgroundColor: config.backgroundColor,
            yAxisID: config.yAxisID,
            tension: config.tension,
            fill: true, // Example: fill area under the line
          },
        ],
      };
    }

    for (const item of forecast) {
      const dt = DateTime.fromISO(item.datetime);

      if (dt.isValid) {
        (newIndividualChartData.temperature.datasets[0].data as number[]).push(
          IsNumber(item?.temperature) && item?.temperature ? item.temperature : NaN
        );
        (newIndividualChartData.pressure.datasets[0].data as number[]).push(
          IsNumber(item?.pressure) && item.pressure ? item.pressure : NaN
        );
        (newIndividualChartData.humidity.datasets[0].data as number[]).push(
          IsNumber(item?.humidity) && item.humidity ? item.humidity : NaN
        );
        (newIndividualChartData.windSpeed.datasets[0].data as number[]).push(
          IsNumber(item?.windSpeed) && item.windSpeed ? item.windSpeed : NaN
        );
        (newIndividualChartData.clouds.datasets[0].data as number[]).push(
          IsNumber(item?.clouds) && item.clouds ? item.clouds : NaN
        );
        (newIndividualChartData.uvi.datasets[0].data as number[]).push(
          IsNumber(item?.uvi) && item.uvi ? item.uvi : NaN
        );

        const formattedTime = dt.toFormat('DD T');
        if (!localLabels.includes(formattedTime)) {
          localLabels.push(formattedTime);
        }
      }
    }

    for (const key in newIndividualChartData) {
      newIndividualChartData[key as ForecastChartKey].labels = localLabels;
    }

    setIndividualChartData(newIndividualChartData);
    setLoading(false);
  }, [forecast]);

  return (
    <div className="space-y-4" style={{ width: '100%', height: 'auto' }}>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(CHART_CONFIGS).map(key => {
          const chartKey = key as ForecastChartKey;
          return (
            <button
              key={chartKey}
              onClick={() => setSelectedChart(chartKey)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${
                  selectedChart === chartKey
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {CHART_CONFIGS[chartKey].label}
            </button>
          );
        })}
      </div>

      <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200 text-center">
        {CHART_CONFIGS[selectedChart].label} Forecast
      </h3>

      {!loading && individualChartData && individualChartData[selectedChart] ? (
        <ChartItem
          options={getChartOptions(selectedChart)} // Pass dynamic options based on selected chart
          data={individualChartData[selectedChart]}
          className="leading-8 text-gray-500 font-normal text-gray-800 dark:text-gray-200"
        />
      ) : (
        !loading && <p className="text-center text-gray-500">No data available for this chart.</p>
      )}
    </div>
  );
}
