import React, { useEffect, useState } from "react";
import "../App.css";
import Infobox from "./infobox";
import Calendar from "./Calendar";
import Timesheet from "./Timesheet";
import ExpenseChartsPage from "./ExpenseChartsPage";
import PaymentChartsPage from "./PaymentChartsPage";
import RecentApplications from "./RecentApplications";
import RecentAnnouncements from "./RecentAnnouncements";
import LightweightStartWork from "../components-mini/LightweightStartWork";
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
      {/* First Row with Attendance and Start Work/Hours Worked */}
      <div className="row pt-4">
        {/* Attendance section (2/3 width) */}
        <div className="col-md-8">
          <div
            className="panel panel-default"
            style={{ height: "calc(100% - 20px)" }}
          >
            <div className="panel-body">
              <Timesheet />
            </div>
          </div>
        </div>

        {/* Right column (1/3 width) */}
        <div className="col-md-4">
          {/* StartWork section */}
          <div className="panel panel-default">
            <div className="panel-body">
              <LightweightStartWork />
            </div>
          </div>

          {/* HoursWorked section */}
          <div className="panel panel-default">
            <div className="panel-body">
              <HoursWorkedLastWeek />
            </div>
          </div>
        </div>
      </div>

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

      {/* Third Row with Expense and Payment Reports */}
      <div className="row pt-4">
        <div className="col-md-6">
          <div className="panel panel-default">
            <ExpenseChartsPage />
          </div>
        </div>
        <div className="col-md-6">
          <div className="panel panel-default">
            <PaymentChartsPage />
          </div>
        </div>
      </div>

      {/* Fourth Row with Recent Applications and Announcements */}
      <div className="row pt-4">
        <div className="col-md-6">
          <div className="panel panel-default">
            <RecentApplications />
          </div>
        </div>
        <div className="col-md-6">
          <div className="panel panel-default">
            <RecentAnnouncements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
