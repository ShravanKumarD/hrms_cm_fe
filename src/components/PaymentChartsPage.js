import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import API_BASE_URL from "../env";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const SelectYearContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const SelectYear = styled.select`
  padding: 5px 10px;
  font-size: 16px;
  margin-left: 10px;
`;

const ChartContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
`;

const theme = {
  chartColor: "#007fad",
};

const ExpenseChartsPage = () => {
  const [chartData, setChartData] = useState({});
  const [paymentYear, setPaymentYear] = useState(2024);

  const fetchData = useCallback(async () => {
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const response = await axios.get(`/api/payments/year/${paymentYear}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = transformData(response.data);
      const chartConfig = makeChartConfig(data);
      setChartData(chartConfig);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  }, [paymentYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transformData = (data) =>
    data.map((item) => ({
      ...item,
      expenses: parseInt(item.expenses, 10),
    }));

  const makeChartConfig = (data) => ({
    labels: data.map((item) => item.month),
    datasets: [
      {
        data: data.map((item) => item.expenses),
        backgroundColor: theme.chartColor,
      },
    ],
  });

  const handleYearChange = (event) => {
    setPaymentYear(event.target.value);
  };

  return (
    <Container>
      <SelectYearContainer>
        <span>Select Year:</span>
        <SelectYear onChange={handleYearChange} value={paymentYear}>
          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </SelectYear>
      </SelectYearContainer>
      <ChartContainer>
        <Bar
          data={chartData}
          height={300}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 2000,
                },
              },
            },
          }}
          redraw
        />
      </ChartContainer>
    </Container>
  );
};

export default ExpenseChartsPage;
