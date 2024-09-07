import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { loadTree } from "../menuTreeHelper";
// import Logo from "../assets/samcintlogowhite.png";
import TodaysWorkStatus from "../components-mini/TodaysWorkStatus";
import styled, { ThemeProvider } from "styled-components";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaRocket,
  FaRupeeSign,
  FaBell,
  FaAngleLeft,
  FaCalendarAlt,
  FaBriefcase,
  FaListUl,
  FaFile,
  FaInfoCircle,
  FaAddressCard,
} from "react-icons/fa";
import LogoWhite from "../assets/samcintlogowhite.png";
import Logo from "../assets/samcint_logo_2.png";
import LogoMini from "../assets/10.png";
import { GiFallingBlob } from "react-icons/gi";
import './../App.css';


const theme = {
  primary: "#27ae60",
  secondary: "#27ae60",
  active: "#1e8449",
  hover: "rgba(255, 255, 255, 0.2)",
  text: "#FFFFFF",
  scrollbarThumb: "rgba(255, 255, 255, 0.3)",
  scrollbarTrack: "rgba(255, 255, 255, 0.1)",
};

const Sidebar = styled.aside`
  position: fixed;
  left: ${(props) => (props.isCollapsed ? "20px" : "20px")};
  top: 42.7%;
  transform: translateY(-42.7%);
  height: 70vh;
  width: ${(props) => (props.isCollapsed ? "70px" : "250px")};
  background: linear-gradient(135deg, #2f631e, rgba(39, 174, 96, 0.8));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  transition: all 0.3s ease;
  overflow-y: hidden; /* Hide the vertical scrollbar */
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.text};
  z-index: 1001;
`;

const LogoContainer = styled.div`
  padding: 20px;
  text-align: center;
  cursor: pointer;
  // background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px 20px 0 0;
  backdrop-filter: blur(10px);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(57, 255, 20, 0.3); // Neon green shadow
  }
`;

const StyledLogo = styled.img`
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
  border-radius: 10px;
`;

const NavMenu = styled.nav`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px 0;
  // background: rgba(255, 255, 255, 0.2);
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  backdrop-filter: blur(10px);

  // dont show scrollbar when not hovering
  scrollbar-width: none;

  &:hover {
  /* Scrollbar Styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.scrollbarTrack};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarThumb};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.hover};
  }

  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme.scrollbarThumb}
    ${(props) => props.theme.scrollbarTrack};
    
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 15px;
  color: ${(props) => props.theme.text};
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.hover};
    color: ${(props) => props.theme.text};
  }

  &.active {
    // background-color: ${(props) => props.theme.active};
    color: ${(props) => props.theme.text};
  }

  svg {
    margin-right: 10px;
    font-size: 1.5em;
  }
`;

const SubNavItem = styled(NavItem)`
  padding-left: 40px;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  font-size: 1.2em;
`;
const SidebarHr = ({onToggle}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [user, setUser] = useState({});
  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    loadTree();
  }, []);
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <ThemeProvider theme={theme}>
        <Sidebar isCollapsed={isCollapsed}>
    <aside className="main-sidebar elevation-4">
      {/* Brand Logo */}
      <img src={Logo} className="logo-main" alt="company-logo" />
      <a href="/" className="brand-link">
        <span className="brand-text font-weight-light ml-1">
          <strong>HR Manager</strong>
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
                  <NavLink to="/attendance/startwork" className="nav-link">
                    <i className="fas fa-briefcase nav-icon" />
                    <p>Start Work</p>
                    <TodaysWorkStatus userId={userId} />
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/attendance-list" className="nav-link">
                    <i className="fas fa-list nav-icon" />
                    <p>Attendance List</p>
                  </NavLink>
                </li>
              </ul>
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
            {/* Job List */}
            <li className="nav-item">
              <NavLink to="/job-list" className="nav-link">
                <i className="nav-icon fas fa-briefcase" />
                <p>Job List</p>
              </NavLink>
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
                  <NavLink to="/employee-add" className="nav-link">
                    <i className="fa fa-user-plus nav-icon" />
                    <p>Add Employee</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/employee-list" className="nav-link">
                    <i className="fas fa-users nav-icon" />
                    <p>Employee List</p>
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Document Management */}
            <li className="nav-item has-treeview">
              <NavLink
                to="/fake-url"
                className="nav-link"
                activeClassName="nav-link"
              >
                <i className="nav-icon fas fa-file-alt" />
                <p>
                  Documents
                  <i className="right fas fa-angle-left" />
                </p>
              </NavLink>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/salary-slip-list" className="nav-link">
                    <i className="fas fa-file-invoice-dollar nav-icon" />
                    <p>Salary Slip</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/offer-letter-list" className="nav-link">
                    <i className="fas fa-file-signature nav-icon" />
                    <p>Offer Letter</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/hike-letter-list" className="nav-link">
                    <i className="fas fa-file-alt nav-icon" />
                    <p>Hike Letter</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/relieving-letter-list" className="nav-link">
                    <i className="fas fa-file-export nav-icon" />
                    <p>Relieving Letter</p>
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Payroll Management */}
            <li className="nav-item has-treeview">
              <NavLink
                to="/fake-url"
                className="nav-link"
                activeClassName="nav-link"
              >
                <i className="nav-icon fas fa-rupee-sign" />
                <p>
                  Payroll
                  <i className="right fas fa-angle-left" />
                </p>
              </NavLink>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/salary-details" className="nav-link">
                    <i className="fas fa-rupee-sign nav-icon" />
                    <p>Manage Salary Details</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/salary-list" className="nav-link">
                    <i className="fas fa-users nav-icon" />
                    <p>Employee Salary List</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink exact to="/salary-view-hr" className="nav-link">
                    <i className="nav-icon fas fa-rupee-sign" />
                    <p>My Salary Details</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/payment" className="nav-link">
                    <i className="fas fa-money-check nav-icon" />
                    <p>Make Payment</p>
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
            <li className="nav-item">
              <NavLink exact to="/announcement" className="nav-link">
                <i className="nav-icon fa fa-bell" />
                <p>Announcements</p>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div style={{ marginTop: "200px" }}></div>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
    </Sidebar>
    </ThemeProvider>
  );
};

export default SidebarHr;
