import React, { useState, useEffect } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";
import Logo from "../assets/samcintlogowhite.png";
import TodaysWorkStatus from "../components-mini/TodaysWorkStatus";

const SidebarManager = () => {
  console.log('manager')
  const [user, setUser] = useState({});
  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    loadTree();
  }, []); // The empty array ensures this runs only once on component mount

  return (
    <aside className="main-sidebar elevation-4">
      {/* Brand Logo */}
      <img src={Logo} className="logo-main" alt="company-logo" />
      <a href="/" className="brand-link">
        <span className="brand-text font-weight-light ml-1">
          <strong>MANAGER</strong>
        </span>
      </a>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src={process.env.PUBLIC_URL + "/user-64.png"}
              className="img-circle elevation-2"
              alt="User"
            />
          </div>
          <div className="info">
            <a href="#" className="d-block">
              {user?.fullname}
            </a>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {/* Dashboard */}
            <li className="nav-item">
              <NavLink exact to="/" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>
                  Dashboard
                  <span className="right badge badge-success">Home</span>
                </p>
              </NavLink>
            </li>

            {/* Attendance Management */}
            <li className="nav-item has-treeview">
              <NavLink
                to="/fake-url"
                className="nav-link"
                activeClassName="nav-link"
              >
                <i className="nav-icon fas fa-calendar-check" />
                <p>
                  Attendance
                  <i className="right fas fa-angle-left" />
                </p>
              </NavLink>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/attendance/timesheet" className="nav-link">
                    <i className="fas fa-calendar-alt nav-icon" />
                    <p>Timesheet</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/attendance/mark" className="nav-link">
                    <i className="fas fa-check-circle nav-icon" />
                    <p>Mark Attendance</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/attendance/startwork" className="nav-link">
                    <i className="fas fa-briefcase nav-icon" />
                    <p>Start Work</p>
                    <TodaysWorkStatus userId={userId} />
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/attendance/list" className="nav-link">
                    <i className="fas fa-list nav-icon" />
                    <p>Attendance List</p>
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Job List */}
            <li className="nav-item">
              <NavLink to="/job-list" className="nav-link">
                <i className="nav-icon fas fa-briefcase" />
                <p>Job List</p>
              </NavLink>
            </li>

            {/* Applications */}
            <li className="nav-item has-treeview">
              <NavLink
                to="/fake-url"
                className="nav-link"
                activeClassName="nav-link"
              >
                <i className="nav-icon fa fa-rocket" />
                <p>
                  Applications
                  <i className="right fas fa-angle-left" />
                </p>
              </NavLink>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/application" className="nav-link">
                    <i className="fa fa-plus nav-icon" />
                    <p>Add Application</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/application-list" className="nav-link">
                    <i className="fas fa-list-ul nav-icon" />
                    <p>Application List</p>
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Employee */}
            <li className="nav-item has-treeview">
              <NavLink
                to="/fake-url"
                className="nav-link"
                activeClassName="nav-link"
              >
                <i className="nav-icon fa fa-user" />
                <p>
                  Employee
                  <i className="right fas fa-angle-left" />
                </p>
              </NavLink>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/employee-list" className="nav-link">
                    <i className="fas fa-users nav-icon" />
                    <p>Employee List</p>
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Expense Management */}
            <li className="nav-item has-treeview">
              <NavLink
                to="/fake-url"
                className="nav-link"
                activeClassName="nav-link"
              >
                <i className="nav-icon fas fa-money-bill" />
                <p>
                  Expense
                  <i className="right fas fa-angle-left" />
                </p>
              </NavLink>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/expense" className="nav-link">
                    <i className="fas fa-shopping-cart nav-icon" />
                    <p>Make Expense</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/expense-report" className="nav-link">
                    <i className="fas fa-file-invoice nav-icon" />
                    <p>Expense Report</p>
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Announcements */}
            <li className="nav-item">
              <NavLink exact to="/announcement" className="nav-link">
                <i className="nav-icon fa fa-bell" />
                <p>Announcements</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SidebarManager;
