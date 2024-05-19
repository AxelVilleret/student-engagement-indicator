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


export default function BarChartComponent({labels, datas}) {
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
    },
  };
  
  const data = {
    labels,
    datasets: [
      {
        label: labels,
        data: datas,
        backgroundColor: 'rgb(255, 136, 153)',
        },
    ],
  };

  return <Bar options={options} data={data} />;
}
