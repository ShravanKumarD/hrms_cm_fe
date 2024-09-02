import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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

// Define your theme
const theme = {
  primary: "#27ae60", // Darker green
  secondary: "#1e8449", // Even darker green
  hover: "#27ae60", // Darker green
  active: "#1e8449", // Even darker green
  text: "#FFFFFF",
};

// Sidebar styling
const Sidebar = styled.aside`
  position: fixed;
  left: ${(props) => (props.isCollapsed ? "20px" : "20px")};
  top: 50%;
  transform: translateY(-50%);
  height: 70vh;
  width: ${(props) => (props.isCollapsed ? "70px" : "250px")};
  background: linear-gradient(
    135deg,
    rgba(46, 204, 113, 0.8),
    rgba(39, 174, 96, 0.8)
  );
  backdrop-filter: blur(10px);
  border-radius: 20px;
  transition: all 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.text};
  z-index: 1001;
`;

// Logo container styling
const LogoContainer = styled.div`
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px 20px 0 0;
  backdrop-filter: blur(10px);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
  }
`;

// Styled logo
const StyledLogo = styled.img`
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
  border-radius: 10px;
`;

// Navigation menu styling
const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

// Navigation item styling
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
    background-color: ${(props) => props.theme.active};
    color: ${(props) => props.theme.text};
  }

  svg {
    margin-right: 10px;
    font-size: 1.5em;
  }
`;

// Sub-navigation item styling
const SubNavItem = styled(NavItem)`
  padding-left: 40px;
`;

// Toggle button styling
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

const SidebarEmployee = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

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

  const toggleSubMenu = (menu) => {
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Sidebar isCollapsed={isCollapsed}>
        <ToggleButton onClick={toggleSidebar}>
          <FaAngleLeft
            style={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
          />
        </ToggleButton>
        <LogoContainer onClick={toggleSidebar}>
          <StyledLogo
            src={isCollapsed ? LogoMini : LogoWhite}
            alt="Company Logo"
          />
        </LogoContainer>
        <NavMenu>
          <NavItem to="/" exact>
            <FaTachometerAlt />
            {!isCollapsed && "Dashboard"}
          </NavItem>
          <NavItem to="/employee-view">
            <FaAddressCard />
            {!isCollapsed && "My Profile"}
          </NavItem>
          {/* <NavItem to="/attendance/timesheet">
            <FaCalendarAlt />
            {!isCollapsed && "Timesheet"}
          </NavItem> */}
          {/* <NavItem to="/attendance/startwork">
            <FaBriefcase />
            {!isCollapsed && "Start Work"}
          </NavItem> */}
          <NavItem to="/application-list">
            <FaRocket />
            {!isCollapsed && "My Applications"}
          </NavItem>
          <NavItem to="/salary-view">
            <FaRupeeSign />
            {!isCollapsed && "My Salary Details"}
          </NavItem>
          <NavItem to="/announcement">
            <FaBell />
            {!isCollapsed && "Announcements"}
          </NavItem>
          {/* <NavItem to="/documents">
            <FaFile />
            {!isCollapsed && "My Documents"}
          </NavItem> */}
        </NavMenu>
      </Sidebar>
    </ThemeProvider>
  );
};

export default SidebarEmployee;
