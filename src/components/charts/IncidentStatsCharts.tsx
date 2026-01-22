import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { IncidentStats } from '../../models/stats.types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface IncidentStatsChartsProps {
  stats: IncidentStats;
}

export const IncidentStatsCharts: React.FC<IncidentStatsChartsProps> = ({ stats }) => {
  const typeLabels = Object.keys(stats.byType);
  const typeData = Object.values(stats.byType);

  const pieData = {
    labels: typeLabels,
    datasets: [
      {
        data: typeData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const sortedTriggers = Object.entries(stats.byTrigger).sort(([, a], [, b]) => b - a);

  const triggerLabels = sortedTriggers.map(([label]) => label);
  const triggerData = sortedTriggers.map(([, value]) => value);

  const barData = {
    labels: triggerLabels,
    datasets: [
      {
        label: 'Occurrences',
        data: triggerData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const heatmapValues = Object.entries(stats.byTime.dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));

  // Find range for heatmap
  const dates = heatmapValues.map(v => new Date(v.date).getTime());
  const maxDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

  // Adjust range to show at least 6 months if range is small, or just show full year
  const endDate = new Date(maxDate);
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - 6);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Incidents</h3>
          <p className="text-2xl font-bold dark:text-white">{stats.byTime.totalIncidents}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</h3>
          <p className="text-2xl font-bold dark:text-white">
            {stats.byTime.totalDurationHours.toFixed(1)}h
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Duration</h3>
          <p className="text-2xl font-bold dark:text-white">
            {stats.byTime.averageDurationHours.toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Incident Heatmap</h3>
        <div className="calendar-heatmap-container">
          <CalendarHeatmap<string>
            startDate={startDate}
            endDate={endDate}
            values={heatmapValues}
            classForValue={value => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              return `color-scale-${Math.min(value.count, 4)}`;
            }}
            titleForValue={value => {
              if (!value) return 'No incidents';
              return `${value.date}: ${value.count} incidents`;
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Incidents by Type</h3>
          <div className="h-64 flex justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Top Triggers</h3>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .calendar-heatmap-container {
          overflow-x: auto;
          padding-bottom: 1rem;
        }
        .react-calendar-heatmap .color-empty { fill: #ebedf0; }
        .dark .react-calendar-heatmap .color-empty { fill: #2d333b; }
        .react-calendar-heatmap .color-scale-1 { fill: #9be9a8; }
        .react-calendar-heatmap .color-scale-2 { fill: #40c463; }
        .react-calendar-heatmap .color-scale-3 { fill: #30a14e; }
        .react-calendar-heatmap .color-scale-4 { fill: #216e39; }
        
        .react-calendar-heatmap rect:hover {
          stroke: #555;
          stroke-width: 1px;
        }
      `}</style>
    </div>
  );
};
