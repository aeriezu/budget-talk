"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Outlook() {
  const [tuition, setTuition] = useState(null);
  const [income, setIncome] = useState(null);
  const [deadline, setDeadline] = useState(null); // For storing the tuition payment deadline
  const [advisorResponse, setAdvisorResponse] = useState("");
  const [lastMonthSpending, setLastMonthSpending] = useState(2700); // Mock last month's spending
  const currentYear = new Date().toLocaleString('default', { year: 'numeric' });
  const storedGoals = JSON.parse(localStorage.getItem("goals")) || [];
  const totalSpentThisMonth = storedGoals.reduce((total, goal) => total + goal.spent, 0);

  const router = useRouter();

  // Spending data for the last 6 months (pseudo data)
  const spendingData = [2500, 2300, 2800, 2400, 2700, totalSpentThisMonth]; // Mock values
  const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]; // Labels for the months
    
  useEffect(() => {
    const storedTuition = localStorage.getItem("tuition");
    const storedIncome = localStorage.getItem("income");
    const storedDeadline = localStorage.getItem("deadline");

    // Only redirect if data is missing
    if (!storedTuition || !storedIncome || !storedDeadline) {
      console.log("Missing data, redirecting...");
      router.push("/tuition"); // Redirect to the Tuition page to collect data
    } else {
      setTuition(storedTuition);
      setIncome(storedIncome);
      setDeadline(storedDeadline);
    }

  }, [router]);

  if (!tuition || !income || !deadline) return <p>Loading...</p>;

  // Calculate the countdown until the deadline
  const currentDate = new Date();
  const deadlineDate = new Date(deadline); // Convert the stored deadline string to a Date object
  const timeRemaining = deadlineDate - currentDate;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24)); // Convert time difference to days

  // ChartJS Data
  const chartData = {
    labels: months, // Months
    datasets: [
      {
        label: "Spending",
        data: spendingData, // Spending data
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Light green background for bars
        borderColor: "rgba(75, 192, 192, 1)", // Green border color for bars
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="outlook-container">
      <h1 className="title">{currentYear} Financial Outlook</h1>

      {/* Spending Habits Graph */}
      <div className="spending-habits-chart">
        <h2 className="card-title">Spending Habits (Last 6 Months)</h2>
        <Bar data={chartData} />
      </div>

      {/* Tuition Info Card */}
      <div className="card tuition-card">
        <h2 className="card-title">Tuition Information</h2>
        <p className="card-text">Rate: <strong>${tuition}</strong>/sem</p>
        <p className="card-text">Income: <strong>${income}</strong>/month</p>
        <p className="card-text">Payment Due Date: <strong>{new Date(deadline).toLocaleDateString()}</strong></p>
        <p className="card-text">Time Remaining: <strong>{daysRemaining} days</strong></p>
      </div>

      {/* Spending Difference Card with pseudo-data */}
      <div className="card spending-difference-card">
      <h2 className="card-title">Spending Difference</h2>
        {lastMonthSpending > totalSpentThisMonth ? (
            <p className="card-text">
            You have spent <strong>${(lastMonthSpending - totalSpentThisMonth).toFixed(2)}</strong> less than last month. 🎉
            </p>
        ) : (
            <p className="card-text">
            You have spent <strong>${(totalSpentThisMonth - lastMonthSpending).toFixed(2)}</strong> more than last month. ⚠️
            </p>
        )}
      </div>
    </div>
  );
}