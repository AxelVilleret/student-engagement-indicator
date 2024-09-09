import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChartComponent = ({ data, labels }) => {

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
    <ReactApexChart options={options} series={data} type="polarArea" />
  );
};

export default ApexChartComponent;
