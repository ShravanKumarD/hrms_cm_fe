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
`;

const ClosedSidebar = styled.aside`
  width: 80px;
  background-color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarItem = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  &.active {
    background: linear-gradient(to right, #ff8c00, #ffa500);
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #ff8c00;
    }
    box-shadow: 0 0 10px rgba(255, 140, 0, 0.3);
  }

  i {
    font-size: 24px;
    color: ${(props) => (props.active ? "white" : "#333")};
  }
`;

const OpenButton = styled.button`
  position: absolute;
  bottom: 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #333;
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
    <Sidebar className="main-sidebar elevation-4">
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          marginTop: "30px",
          marginBottom: "30px",
        }}
        data-widget="pushmenu"
        onClick={toggleSidebar}
      >
        {/* if toggled show Logo otherwise LogoMini */}
        {isPushed ? ( <img src={LogoMini} className="logo-mini" alt="company-logo" /> ) : ( <img src={Logo} className="logo-main" alt="company-logo" /> )}
      </div>
      <div
        style={{ display: "flex", justifyContent: "left", marginLeft: "20px" }}
      >
        <span style={{ textAlign: "left" }}>Employee</span>
      </div>
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
              {user.fullname}
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
            {/* Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library */}
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
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </Sidebar>
  );
};

export default SidebarEmployee;
