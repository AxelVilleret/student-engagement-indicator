import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChartComponent = ({ datas, labels }) => {

  const options = { 
    labels: labels,
    chart: {
      type: 'polarArea',
    },
    stroke: {
      colors: ['#fff'],
    },
    fill: {
      opacity: 0.8,
    },
  };

  return (
    <div id="chart">
      <ReactApexChart options={options} series={datas} type="polarArea" />
    </div>
  );
};

export default ApexChartComponent;
