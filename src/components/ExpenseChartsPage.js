import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

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

  const fetchData = () => {
    axios.defaults.baseURL = "http://localhost:80";
    axios({
      method: "get",
      url: `api/expenses/year/${expenseYear}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        const data = transformData(res.data);
        const array = makeArrayStructure(data);
        setChartData(array);
      })
      .catch((err) => {
        console.error("err", err);
      });
  };

  const transformData = (data) => {
    return data.map((obj) => ({
      ...obj,
      expenses: parseInt(obj.expenses, 10),
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
    setExpenseYear(event.target.value);
  };

  return (
    <div className="card">
      <div className="mt-1" style={{ textAlign: "center" }}>
        <span className="ml-4">Select Year: </span>
        <select onChange={handleChange} value={expenseYear}>
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
            legend: {
              display: false,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    min: 0,
                    stepSize: 300,
                  },
                },
              ],
            },
          }}
          redraw
        />
      </div>
    </div>
  );
};

export default ExpenseChartsPage;
