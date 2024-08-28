import React, { useState, useEffect } from "react";

import "../../App.css";
import RecentApplications from "../employee/RecentApplications";
import RecentAnnouncements from "../RecentAnnouncementsManagerEmp";
import TimesheetMini from "../../components-mini/TimesheetMini";
import LightweightStartWork from "../../components-mini/LightweightStartWork";
import HoursWorkedLastWeek from "../../components-mini/HoursWorkedLastWeek";


const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const departmentId = JSON.parse(localStorage.getItem("user")).departmentId;
    // Perform necessary actions with departmentId, like fetching data
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
              <TimesheetMini />
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

// <div className="row pt-4">
//   {/* Calendar */}
//   <div className="col-sm-6">
//     <EmployeeViewDashboard />
//     <div className="panel panel-default">
//       <div className="panel-heading with-border" style={{ backgroundColor: "#515e73", color: "white" }}>
//         <h3 className="panel-title">Recent Announcements</h3>
//       </div>
//       <RecentAnnouncements />
//     </div>
//   </div>
//   {/* Expense Report & Recent Applications */}
//   <div className="col-md-6">
//     <Calendar />
//     <div className="panel panel-default">
//       <div className="panel-heading with-border" style={{ backgroundColor: "#515e73", color: "white" }}>
//         <h3 className="panel-title">My Recent Applications</h3>
//       </div>
//       <RecentApplications />
//     </div>
//   </div>
// </div>
