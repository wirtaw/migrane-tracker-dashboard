import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface IChartItemProps {
  data: ChartData<'line'>;
  options: ChartOptions<'line'>;
  className?: string;
}

export default function ChartItem({ data, options, className }: IChartItemProps) {
  return (
    <div className={className} style={{ width: '100%', height: 'auto' }}>
      <Line options={options} data={data} />
    </div>
  );
}
