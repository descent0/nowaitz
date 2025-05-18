import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {
  const users = useSelector(state => state.authUser.users.filter(user => user.role==="user"));

  // Group users by month-year of createdAt
  const getMonthlyUserCounts = () => {
    const counts = {};
    users.forEach(user => {
      if (!user.createdAt) return;
      const date = new Date(user.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      counts[monthYear] = (counts[monthYear] || 0) + 1;
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(counts).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      const aDate = new Date(`20${aYear}`, new Date(Date.parse(aMonth +" 1, 2012")).getMonth());
      const bDate = new Date(`20${bYear}`, new Date(Date.parse(bMonth +" 1, 2012")).getMonth());
      return aDate - bDate;
    });

    // Cumulative sum for growth
    let cumulative = 0;
    const data = sortedMonths.map(month => {
      cumulative += counts[month];
      return cumulative;
    });

    return { months: sortedMonths, data };
  };

  const { months, data } = getMonthlyUserCounts();

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'User Growth',
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'User Growth History',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Users' }
      },
      x: {
        title: { display: true, text: 'Month' }
      }
    },
  };

  return (
    <div style={{ minHeight: 300 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}