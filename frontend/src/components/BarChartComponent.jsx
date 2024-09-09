import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function BarChartComponent({labels, data}) {
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
    },
  };
  
  const formattedData = {
    labels,
    datasets: [
      {
        label: labels,
        data: data,
        backgroundColor: 'rgb(255, 136, 153)',
        },
    ],
  };

  return <Bar options={options} data={formattedData} />;
}
