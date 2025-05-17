"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    labels: ["Platform Revenue", "Service Provider Earnings", "Pending Payouts"],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#1e88e5", "#ffb300"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
