import React, { useState, useEffect } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";
import Logo from "../assets/samcint_logo_2.png";
import LogoMini from "../assets/10.png";
import TodaysWorkStatus from "../components-mini/TodaysWorkStatus";
import styled from "styled-components";

// Styled components
const Sidebar = styled.aside`
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  width: ${(props) => (props.isPushed ? "70px" : "250px")};
  overflow: hidden;
`;

const SidebarEmployee = () => {
  const [user, setUser] = useState({});
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [isPushed, setIsPushed] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    loadTree();
  }, []);

  const toggleSidebar = () => setIsPushed(!isPushed);

  return (
    <Sidebar className="main-sidebar elevation-4" isPushed={isPushed}>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          marginTop: "30px",
          marginBottom: "30px",
        }}
        onClick={toggleSidebar}
      >
        {isPushed ? (
          <img src={LogoMini} className="logo-mini" alt="company-logo" />
        ) : (
          <img src={Logo} className="logo-main" alt="company-logo" />
        )}
      </div>
      <div className="sidebar">
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
              {user.fullname}
            </a>
          </div>
        </div>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <NavLink exact to="/" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>
                  Dashboard
                  <span className="right badge badge-success">Home</span>
                </p>
              </NavLink>
            </li>
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
                  <NavLink to="/attendance/startwork" className="nav-link">
                    <i className="fas fa-briefcase nav-icon" />
                    <p>Start Work</p>
                    <TodaysWorkStatus userId={userId} />
                  </NavLink>
                </li>
              </ul>
            </li>
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
                    <p>Application</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/application-list" className="nav-link">
                    <i className="fas fa-list-ul nav-icon" />
                    <p>My Applications</p>
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink exact to="/salary-view" className="nav-link">
                <i className="nav-icon fas fa-rupee-sign" />
                <p>My Salary Details</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/announcement" className="nav-link">
                <i className="nav-icon fa fa-bell" />
                <p>Announcements</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </Sidebar>
  );
};

export default SidebarEmployee;