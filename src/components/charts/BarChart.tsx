'use client';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const BarChart = (props: any) => {
  const { chartData, chartOptions } = props;

  return (
    <Chart
      options={chartOptions}
      type="bar"
      width="100%"
      height="100%"
      series={chartData}
    />
  );
};

export default BarChart;
