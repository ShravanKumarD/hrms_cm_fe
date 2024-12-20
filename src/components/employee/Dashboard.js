import React, { useState, useEffect } from "react";

import "../../App.css";
import RecentApplications from "../employee/RecentApplications";
import RecentAnnouncements from "../RecentAnnouncementsManagerEmp";
import TimesheetMini from "../../components-mini/TimesheetMini";
import LightweightStartWork from "../../components-mini/LightweightStartWork";
import HoursWorkedLastWeek from "../../components-mini/HoursWorkedLastWeek";
import LeaveBalance from "../../components-mini/LeaveBalance";
import themes from "../../constants/themes";

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  const selectedTheme = themes.green;

  useEffect(() => {
    const departmentId = JSON.parse(localStorage.getItem("user")).departmentId;
    // Perform necessary actions with departmentId, like fetching data
  }, []);

  return (
    <div>
      <div className="row">
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
          <LightweightStartWork theme={selectedTheme} />
          {/* <HoursWorkedLastWeek theme={selectedTheme} /> */}
          <LeaveBalance theme={selectedTheme} />
          <RecentAnnouncements />
        </div>
      </div>

      {/* Fourth Row with Recent Applications and Announcements */}
      <div className="row pt-4">
        <div className="col-md-6">{/* <RecentApplications /> */}</div>
        <div className="col-md-6"></div>
      </div>
    </div>
  );
};

export default Dashboard;
