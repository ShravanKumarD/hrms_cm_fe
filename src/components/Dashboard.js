import React, { useEffect, useState } from "react";
import "../App.css";
import Infobox from "./infobox";
import Calendar from "./Calendar";
import ExpenseChartsPage from "./ExpenseChartsPage";
import PaymentChartsPage from "./PaymentChartsPage";
import RecentApplications from "./RecentApplications";
import RecentAnnouncements from "./RecentAnnouncements";
import LightweightStartWork from "./LightweightStartWork";
import axios from "axios";
import HoursWorkedLastWeek from "../components-mini/HoursWorkedLastWeek";

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const { data } = await axios.get("/api/users/total", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTotalEmployees(parseInt(data));
      } catch (err) {
        console.error("Error fetching total employees:", err);
      }
    };

    const fetchTotalExpenses = async () => {
      try {
        const { data } = await axios.get("/api/expenses/year/2024", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.length > 0) {
          const total = data.reduce(
            (sum, item) => sum + parseInt(item.expenses),
            0
          );
          setTotalExpenses(total);
        }
      } catch (err) {
        console.error("Error fetching total expenses:", err);
      }
    };

    const fetchTotalPayments = async () => {
      try {
        const { data } = await axios.get("/api/payments/year/2024", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.length > 0) {
          const total = data.reduce(
            (sum, item) => sum + parseInt(item.expenses),
            0
          );
          setTotalPayments(total);
        }
      } catch (err) {
        console.error("Error fetching total payments:", err);
      }
    };

    fetchTotalEmployees();
    fetchTotalExpenses();
    fetchTotalPayments();
  }, []);

  return (
    <div>
      {/* First Row with small info-boxes */}
      <div className="row pt-4">
        <div className="col-md-4 col-sm-6 col-xs-12">
          <Infobox
            title="Total Employees"
            description={totalEmployees}
            color="bg-success"
            icon="fa fa-users"
          />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-12">
          <Infobox
            title="Total Expenses"
            description={`₹${totalExpenses}`}
            color="bg-warning"
            icon="fa fa-shopping-cart"
          />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-12">
          <Infobox
            title="Total Payments"
            description={`₹${totalPayments}`}
            color="bg-danger"
            icon="fa fa-money-check"
          />
        </div>
      </div>

      {/* Second Row with Calendar and Expense Report */}
      <div className="row pt-4">
        <div className="col-sm-6">
          <Calendar />
          <div className="panel panel-default">
            <div
              className="panel-heading with-border"
              style={{ backgroundColor: "#515e73", color: "white" }}
            >
              <h3 className="panel-title">Recent Applications</h3>
            </div>
            <RecentApplications />
            <LightweightStartWork />
          </div>
        </div>

        {/* Expense Report & Recent Applications */}
        <div className="col-md-6">
          <div className="panel panel-default">
            <div
              className="panel-heading with-border"
              style={{ backgroundColor: "#515e73", color: "white" }}
            >
              <h3 className="panel-title">Expense Report</h3>
            </div>
            <ExpenseChartsPage />
          </div>
          <div className="panel panel-default">
            <div
              className="panel-heading with-border"
              style={{ backgroundColor: "#515e73", color: "white" }}
            >
              <h3 className="panel-title">Payment Report</h3>
            </div>
            <PaymentChartsPage />
          </div>
          <div className="panel panel-default">
            <div
              className="panel-heading with-border"
              style={{ backgroundColor: "#515e73", color: "white" }}
            >
              <h3 className="panel-title">Recent Announcements</h3>
            </div>
            <RecentAnnouncements />
          </div>
          <div className="panel panel-default">
            <div
              className="panel-heading with-border"
              style={{ backgroundColor: "#515e73", color: "white" }}
            >
              <h3 className="panel-title">Hours Worked Last Week</h3>
            </div>
            <div className="panel-body" style={{ height: "300px" }}>
              <HoursWorkedLastWeek />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
