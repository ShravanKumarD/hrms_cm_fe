import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const HoursWorkedLastWeek = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#4285F4",
          "#FBBC05",
          "#34A853",
          "#EA4335",
          "#4285F4",
        ],
      },
    ],
  });
  const [totalHours, setTotalHours] = useState(0);

  const userId = JSON.parse(localStorage.getItem("user")).id;

  const fetchHoursWorkedLastWeek = async () => {
    try {
      const response = await axios.get(
        `/api/attendance/worked-hours/user/${userId}/last7days`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = transformData(response.data);
      const array = makeArrayStructure(data);
      setChartData(array);
      setTotalHours(data.reduce((sum, day) => sum + day.workedHours, 0));
    } catch (error) {
      console.error("Error fetching hours worked last week:", error);
    }
  };

  const transformData = (data) => {
    return data.map((obj) => ({
      ...obj,
      workedHours: obj.workedHours > 0 ? obj.workedHours : 0,
    }));
  };

  const makeArrayStructure = (data) => {
    return {
      labels: data.slice(-5).map((d) => {
        const date = new Date(d.date);
        return date.toLocaleString("default", { weekday: "short" });
      }),
      datasets: [
        {
          data: data.slice(-5).map((d) => d.workedHours),
          backgroundColor: [
            "#4285F4",
            "#FBBC05",
            "#34A853",
            "#EA4335",
            "#4285F4",
          ],
        },
      ],
    };
  };

  useEffect(() => {
    fetchHoursWorkedLastWeek();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 8,
        ticks: { stepSize: 2 },
      },
    },
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "15px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>Working hours</h3>
        <span style={{ fontWeight: "bold" }}>{totalHours.toFixed(1)} hrs</span>
      </div>
      <div style={{ height: "calc(100% - 40px)" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HoursWorkedLastWeek;
