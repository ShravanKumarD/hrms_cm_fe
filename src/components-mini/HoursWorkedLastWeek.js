import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const HoursWorkedLastWeek = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Hours Worked",
        data: [],
        backgroundColor: "#007fad",
      },
    ],
  });
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
      labels: data.map((d) => d.date), // X-axis labels (dates)
      datasets: [
        {
          label: "Hours Worked", // Label for the dataset
          data: data.map((d) => d.workedHours), // Y-axis data (worked hours)
          backgroundColor: "#007fad", // Bar color
        },
      ],
    };
  };

  useEffect(() => {
    fetchHoursWorkedLastWeek();
  }, []);

  return (
    <div>
      <h2>Hours Worked Last Week</h2>
      <Bar
        data={chartData}
        height={300}
        options={{
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          // scales: {
          //   yAxes: [
          //     {
          //       ticks: {
          //         min: 0,
          //         stepSize: 300,
          //       },
          //     },
          //   ],
          // },
        }}
        redraw
      />
    </div>
  );
};

export default HoursWorkedLastWeek;
