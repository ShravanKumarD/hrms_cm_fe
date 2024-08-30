import React, { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import styled from "styled-components";

const HoursContainer = styled.div`
  width: 100%;
  height: 280px;
  background: ${(props) => props.theme.panelBackground || "#f0f0f0"};
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  background: ${(props) => props.theme.primaryColor || "#4CAF50"};
  color: ${(props) => props.theme.textColor || "#f0f0f0"};
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const AverageHours = styled.p`
  font-weight: bold;
  font-size: 15px;
  color: ${(props) => props.theme.textColor || "#f0f0f0"};
  margin: 0;

  span {
    opacity: 0.7;
    font-size: 10px;
  }
`;

const ChartContainer = styled.div`
  height: 220px;
  margin-top: 10px;
`;

const HoursWorkedLastWeek = ({ theme }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: theme.primaryColor || "#4CAF50",
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
    const last7Days = Array.from({ length: 7 }, (_, i) => {
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
      labels: ["Fri", "Thu", "Wed", "Tue", "Mon", "Sun", "Sat"],
      datasets: [
        {
          data: data.map((d) => d.workedHours).reverse(),
          backgroundColor: theme.primaryColor || "#4CAF50",
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
    legend: { display: false },
    tooltips: { enabled: false },
    scales: {
      xAxes: [
        {
          gridLines: { display: false },
          ticks: {
            fontColor: theme.textColor || "#333",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: theme.gridColor || "#e0e0e0",
          },
          ticks: {
            beginAtZero: true,
            stepSize: 2,
            max: 14,
            fontColor: theme.textColor || "#333",
            callback: (value) => value,
          },
        },
      ],
    },
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <Card
        className="shadow-sm"
        style={{
          maxWidth: "400px",
          width: "100%",
          fontSize: theme.fontSize,
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Header theme={theme}>
          <Title>Working hours</Title>
          <AverageHours theme={theme}>
            {(totalHours / 7).toFixed(1)} hrs <span>/ day</span>
          </AverageHours>
        </Header>
        <HoursContainer theme={theme}>
          <ChartContainer>
            <Bar data={chartData} options={options} />
          </ChartContainer>
        </HoursContainer>
      </Card>
    </Container>
  );
};

export default HoursWorkedLastWeek;
