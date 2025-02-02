"use client";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

Chart.register(ArcElement, Tooltip, Legend);

export default function Analytics() {
  const [goals, setGoals] = useState([]);
  const [chartData, setChartData] = useState({});
  const [overBudgetGoals, setOverBudgetGoals] = useState([]);

  // Get the current month and year
  const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals"));
    if (savedGoals) {
      setGoals(savedGoals);
    }
  }, []);

  useEffect(() => {
    if (goals && goals.length > 0) {
      const labels = goals.map((goal) => goal.name);
      const data = goals.map((goal) => goal.spent);
      const backgroundColors = goals.map(
        (goal) => (goal.spent > goal.goalAmount ? "red" : `hsl(${Math.random() * 360}, 70%, 60%)`)
      );

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Spent",
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      });

      setOverBudgetGoals(goals.filter((goal) => goal.spent > goal.goalAmount));
    }
  }, [goals]);

  return (
    <div className="analytics-container">
      <h2>{currentMonthYear}</h2>

      {/* Chart Container */}
      {chartData.datasets && chartData.datasets.length > 0 ? (
        <div className="card chart-container">
          <Pie data={chartData} />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}

      {/* Over-budget Goals Section */}
      {overBudgetGoals.length > 0 && (
        <div className="card over-budget-card">
          <h3>Over Budget</h3>
          <ul>
            {overBudgetGoals.map((goal) => (
              <li key={goal.id}>
                <strong>{goal.name}:</strong> Spent ${goal.spent} (Budget: ${goal.goalAmount})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
