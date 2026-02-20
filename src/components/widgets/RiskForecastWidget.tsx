import { useEffect, useState } from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Filler);
import { useAuth } from '../../context/AuthContext';
import { fetchRiskForecast } from '../../services/predictions';
import { RiskForecastResponse } from '../../models/predictions.types';
import Loader from '../Loader';

export default function RiskForecastWidget() {
  const { apiSession } = useAuth();
  const [data, setData] = useState<RiskForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiSession?.accessToken) {
      loadForecast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiSession]);

  const loadForecast = async () => {
    try {
      setLoading(true);
      if (!apiSession?.accessToken) return;
      const response = await fetchRiskForecast(apiSession.accessToken);
      setData(response);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load risk forecast');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-500';
    if (score <= 60) return 'text-yellow-500';
    if (score <= 80) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRiskBg = (score: number) => {
    if (score <= 30) return 'bg-green-50 dark:bg-green-900/20';
    if (score <= 60) return 'bg-yellow-50 dark:bg-yellow-900/20';
    if (score <= 80) return 'bg-orange-50 dark:bg-orange-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  const formatHour = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 flex justify-center items-center min-h-[300px]">
        <Loader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Risk Forecast</h2>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error || 'Unable to load risk forecast data'}
        </div>
      </div>
    );
  }

  const chartConfig = {
    labels: data.hourlyRisk.map(hr => formatHour(hr.time)),
    datasets: [
      {
        fill: true,
        label: 'Risk Score',
        data: data.hourlyRisk.map(hr => hr.risk),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', maxTicksLimit: 12 },
      },
      y: {
        grid: { color: 'rgba(107, 114, 128, 0.1)' },
        ticks: { color: '#6b7280' },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4f46e5',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        displayColors: false,
      },
    },
  };

  const diffDays = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Daily Risk Forecast
          </h2>
        </div>
        <div
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold ${getRiskBg(data.dailyRisk)} ${getRiskColor(data.dailyRisk)}`}
        >
          <span className="text-sm font-medium uppercase tracking-wide opacity-80">
            Overall Score:
          </span>
          <span className="text-2xl">{data.dailyRisk}</span>
          <span className="text-sm opacity-60">/ 100</span>
        </div>
      </div>

      <div className="h-64 mb-6 relative">
        <Line options={chartOptions} data={chartConfig} />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-indigo-500" /> Risk Factors Contributing to Score
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Weather
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li className="flex justify-between">
                <span>Temp:</span>{' '}
                <span className="font-medium">{data.factors.weather.temperature.toFixed(2)}°</span>
              </li>
              <li className="flex justify-between">
                <span>Humidity:</span>{' '}
                <span className="font-medium">{data.factors.weather.humidity.toFixed(2)}%</span>
              </li>
              <li className="flex justify-between">
                <span>Pressure:</span>{' '}
                <span className="font-medium">{data.factors.weather.pressure.toFixed(1)} hPa</span>
              </li>
              <li className="flex justify-between">
                <span>UV Index:</span>{' '}
                <span className="font-medium">{data.factors.weather.uvIndex.toFixed(1)}</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Solar Activity
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li className="flex justify-between">
                <span>Kp Index:</span>{' '}
                <span className="font-medium">{data.factors.solar.kpIndex ?? 'N/A'}</span>
              </li>
              <li className="flex justify-between">
                <span>A Index:</span>{' '}
                <span className="font-medium">{data.factors.solar.aIndex ?? 'N/A'}</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              History
            </h4>
            <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-col items-center justify-center h-full pb-4">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {diffDays(data.factors.history.lastIncidentDate)}
              </span>
              <span className="text-xs text-center">Since Last Incident</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
