import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import API_BASE_URL from "../env";

const ExpenseChartsPage = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: "#007fad",
      },
    ],
  });
  const [expenseYear, setExpenseYear] = useState(2024);

  useEffect(() => {
    fetchData();
  }, [expenseYear]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`api/expenses/year/${expenseYear}`, {
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = transformData(response.data);
      const formattedData = formatChartData(data);
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    }
  };

  const transformData = (data) => 
    data.map((item) => ({
      ...item,
      expenses: parseInt(item.expenses, 10),
    }));

  const formatChartData = (data) => ({
    labels: data.map((item) => item.month),
    datasets: [
      {
        data: data.map((item) => item.expenses),
        backgroundColor: "#007fad",
      },
    ],
  });

  const handleChange = (event) => {
    setExpenseYear(Number(event.target.value));
  };

  return (
    <div className="card">
      <div className="mt-1" style={{ textAlign: "center" }}>
        <span className="ml-4">Select Year: </span>
        <select onChange={handleChange} value={expenseYear}>
          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Bar
          data={chartData}
          height={300}
          options={{
            maintainAspectRatio: false,
            legend: { display: false },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 300,
                },
              },
            },
          }}
          redraw
        />
      </div>
    </div>
  );
};

export default ExpenseChartsPage;
