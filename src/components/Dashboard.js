import React, { useEffect, useState } from "react";
import "../App.css";
import Infobox from "./infobox";
import Calendar from "./Calendar";
import ExpenseChartsPage from "./ExpenseChartsPage";
import PaymentChartsPage from "./PaymentChartsPage";
import RecentApplications from "./RecentApplications";
import RecentAnnouncements from "./RecentAnnouncements";
import TimesheetMini from "./../components-mini/TimesheetMini";
// import StartWork from "./StartWork";
// import LightweightStartWork from "../components-mini/LightweightStartWork";
import axios from "axios";
// import HoursWorkedLastWeek from "../components-mini/HoursWorkedLastWeek";
import Holidays from "./Holidays";

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

      <div className="row pt-4">
        <div className="col-sm-6">
          {/* <Calendar /> */}
          <div className="panel-body">
              <TimesheetMini />
            </div>
            <p>&nbsp;</p>
      <div>
      <RecentApplications />
      </div>
        </div>
        <div className="col-md-6">
          {/* <ExpenseChartsPage /> */}
          <Holidays/>
          {/* <PaymentChartsPage /> */}
          <RecentAnnouncements />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
