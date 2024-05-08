import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./BrandAdminChart.css";

function BrandAdminChart({ registeredCount, notRegisteredCount }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (window.myBarChart instanceof Chart) {
      window.myBarChart.destroy();
    }

    window.myBarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Registered", "Not Registered"],
        datasets: [
          {
            label: "Tracking Number",
            data: [registeredCount, notRegisteredCount],
            backgroundColor: ["rgba(0, 255, 255)", "rgba(255, 99, 132)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
            barThickness: 50, // Adjust bar thickness here
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 16 },
              callback: function (value) {
                if (value % 1 === 0) {
                  return value;
                }
              },
            },
          },
          x: { ticks: { font: { size: 16 } } },
        },
      },
    });

    return () => {
      if (window.myBarChart instanceof Chart) {
        window.myBarChart.destroy();
      }
    };
  }, [registeredCount, notRegisteredCount]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} id="brandAdminChart"></canvas>
    </div>
  );
}

export default BrandAdminChart;
