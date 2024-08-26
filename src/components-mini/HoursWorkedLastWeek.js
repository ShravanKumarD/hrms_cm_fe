import React, { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
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
          "#FBBC05",
          "#34A853",
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
    const today = new Date();
    const last7Days = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const dataMap = new Map(data.map((item) => [item.date, item.workedHours]));

    return last7Days.map((date) => ({
      date,
      workedHours: dataMap.get(date) || 0,
    }));
  };

  const makeArrayStructure = (data) => {
    return {
      labels: data.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleString("default", { weekday: "short" });
      }),
      datasets: [
        {
          data: data.map((d) => d.workedHours),
          backgroundColor: [
            "#4285F4",
            "#FBBC05",
            "#34A853",
            "#EA4335",
            "#4285F4",
            "#FBBC05",
            "#34A853",
            "#EA4335",
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
    legend: { display: false }, // Hide legend
    tooltips: { enabled: false }, // Disable tooltips
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: true, // Hide x-axis
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            drawBorder: false,
          },
          ticks: {
            // display: false, // Hide y-axis
            beginAtZero: true,
            stepSize: 2,
            max: 8,
          },
        },
      ],
    },
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center mt-4"
    >
      <Card
        className="shadow-sm"
        style={{
          maxWidth: "400px",
          width: "100%",
          fontSize: "0.95rem",
          borderRadius: "10px", // Added border radius
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            padding: "15px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "white",
            borderRadius: "10px", // Added border radius
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
            <span style={{ margin: 0 }}>Working hours</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "bold" }}>
                {(totalHours / 7).toFixed(1)} hrs
              </span>
              <span style={{ fontSize: "0.5rem", textAlign: "center" }}>
                on avg
              </span>
            </div>
          </div>
          <div style={{ height: "calc(100%)" }}>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </Card>
    </Container>
  );
};

export default HoursWorkedLastWeek;
