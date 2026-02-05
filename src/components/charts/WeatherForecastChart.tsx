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
import { WeatherSettings } from '../../hooks/useWeatherSettings';
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
  settings: WeatherSettings;
}

export default function WeatherForecastChart({ data, settings }: Props) {
  const chartData = data.slice(0, 24);
  const labels = chartData.map(item => DateTime.fromMillis(item.time.getTime()).toFormat('HH:mm'));

  const datasets = [];

  if (settings.showTemperature) {
    datasets.push({
      label: 'Temp (°C)',
      data: chartData.map(item => item.temperature),
      borderColor: '#8884d8',
      backgroundColor: 'rgba(136, 132, 216, 0.5)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    });
  }

  if (settings.showHumidity) {
    datasets.push({
      label: 'Humidity (%)',
      data: chartData.map(item => item.humidity),
      borderColor: '#82ca9d',
      backgroundColor: 'rgba(130, 202, 157, 0.5)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y', // Using same axis for simplicity, or could be 'y1' if scales differ significantly
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
