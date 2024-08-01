import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const ExpenseChartsPage = () => {
  const [chartData, setChartData] = useState([]);
  const [paymentYear, setPaymentYear] = useState(2024);

  const fetchData = useCallback(async () => {
    try {
      axios.defaults.baseURL = "http://localhost:80";
      const res = await axios.get(`/api/payments/year/${paymentYear}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = transformData(res.data);
      const array = makeArrayStructure(data);
      setChartData(array);
    } catch (err) {
      console.log("err", err);
    }
  }, [paymentYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transformData = (data) => {
    return data.map((obj) => ({
      ...obj,
      expenses: parseInt(obj.expenses),
    }));
  };

  const makeArrayStructure = (data) => {
    return {
      labels: data.map((d) => d.month),
      datasets: [
        {
          data: data.map((d) => d.expenses),
          backgroundColor: "#007fad",
        },
      ],
    };
  };

  const handleChange = (event) => {
    setPaymentYear(event.target.value);
  };

  return (
    <div className="card">
      <div className="mt-1" style={{ textAlign: "center" }}>
        <span className="ml-4">Select Year: </span>
        <select onChange={handleChange} value={paymentYear}>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
        </select>
      </div>
      <div>
        <Bar
          data={chartData}
          height={300}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                stepSize: 2000,
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
