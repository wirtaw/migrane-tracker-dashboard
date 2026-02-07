import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { IHourlyForecast } from '../../services/weather';
import { DateTime } from 'luxon';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: IHourlyForecast[];
  type: 'temperature' | 'humidity' | 'pressure' | 'cloudCover';
  duration: 24 | 48 | 72;
}

export default function WeatherForecastChart({ data, type, duration }: Props) {
  const chartData = data.slice(0, duration);
  const labels = chartData.map(item => DateTime.fromMillis(item.time.getTime()).toFormat('HH:mm'));

  const datasets = [];

  if (type === 'temperature') {
    datasets.push({
      label: 'Temp (°C)',
      data: chartData.map(item => item.temperature),
      borderColor: '#8884d8',
      backgroundColor: 'rgba(136, 132, 216, 0.5)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    });
  } else if (type === 'humidity') {
    datasets.push({
      label: 'Humidity (%)',
      data: chartData.map(item => item.humidity),
      borderColor: '#82ca9d',
      backgroundColor: 'rgba(130, 202, 157, 0.5)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    });
  } else if (type === 'pressure') {
    datasets.push({
      label: 'Pressure (hPa)',
      data: chartData.map(item => item.surfacePressure), // Using surfacePressure for 'pressure' chart as per plan
      borderColor: '#ffc658',
      backgroundColor: 'rgba(255, 198, 88, 0.5)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    });
  } else if (type === 'cloudCover') {
    datasets.push({
      label: 'Cloud Cover (%)',
      data: chartData.map(item => item.cloudCover),
      borderColor: '#8884d8', // Reuse color or pick a new one, gray seems appropriate for clouds
      backgroundColor: 'rgba(128, 128, 128, 0.5)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    });
  }

  const chartConfig: ChartData<'line'> = {
    labels,
    datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#94a3b8',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#94a3b8',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line options={options} data={chartConfig} />
    </div>
  );
}
