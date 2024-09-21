import React, { useState, useEffect, useCallback } from "react";
import { loadTree } from "../menuTreeHelper";
import { NavLink } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaRocket,
  FaRupeeSign,
  FaUser,
  FaUsers,
  FaMoneyCheck,
  FaBell,
  FaAngleLeft,
  FaCalendarAlt,
  FaList,
  FaBriefcase,
} from "react-icons/fa";
import LogoWhite from "../assets/samcintlogowhite.png";
import LogoMini from "../assets/10.png";
import "../App.css";

const Sidebar = styled.aside`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  height: 70vh;
  width: ${(props) => (props.isCollapsed ? "70px" : "250px")};
  background: #8adcd2;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.text};
  z-index: 1001;
`;

const LogoContainer = styled.div`
  padding: 20px;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px 20px 0 0;
  backdrop-filter: blur(10px);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
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
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  backdrop-filter: blur(10px);
  scrollbar-width: none;

  &:hover {
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
  }
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

const theme = {
  primary: "#27ae60",
  hover: "rgba(255, 255, 255, 0.2)",
  text: "#FFFFFF",
  scrollbarThumb: "rgba(255, 255, 255, 0.3)",
  scrollbarTrack: "rgba(255, 255, 255, 0.1)",
};

const SidebarManager = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const userId = JSON.parse(localStorage.getItem("user"))?.id || "";

  useEffect(() => {
    loadTree();
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
      if (onToggle) onToggle(newState);
      return newState;
    });
  }, [onToggle]);

  const toggleSubMenu = useCallback((menu, e) => {
    e.preventDefault(); // Prevent the default link behavior
    setExpandedMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Sidebar isCollapsed={isCollapsed}>
        <ToggleButton onClick={toggleSidebar}>
          <FaAngleLeft
            style={{ transform: isCollapsed ? "rotate(180deg)" : "none" }}
          />
        </ToggleButton>
        <LogoContainer onClick={toggleSidebar}>
          <StyledLogo src={isCollapsed ? LogoMini : LogoWhite} alt="Logo" />
        </LogoContainer>
        <NavMenu>
          <NavItem to="/" exact>
            <FaTachometerAlt />
            {!isCollapsed && "Dashboard"}
          </NavItem>
          {/* <NavItem to="/attendance-list">
            <FaCalendarCheck />
            {!isCollapsed && "Attendance List"}
          </NavItem> */}

          <NavItem to="#" onClick={(e) => toggleSubMenu("attendance", e)}>
  <FaCalendarCheck />
  {!isCollapsed && "Attendance"}
</NavItem>
{expandedMenus.attendance && !isCollapsed && (
  <>
    <SubNavItem to="/attendance-list">
      <FaCalendarCheck />
      Attendance Status
    </SubNavItem>
    {/* <SubNavItem to="/attendance-list-detailed">
      <FaList />
      Attendance Overview
    </SubNavItem> */}
    <SubNavItem to="/attendance/startwork">
            <FaBriefcase />
            {!isCollapsed && "Start Work"}
          </SubNavItem>
  </>
)}

          <NavItem to="#" onClick={(e) => toggleSubMenu("employee", e)}>
            <FaUser />
            {!isCollapsed && "Employee"}
          </NavItem>
          {expandedMenus.employee && !isCollapsed && (
            <>
              {/* <SubNavItem to="/emp-view">
                <FaUser />
                {!isCollapsed && "My Profile"}
              </SubNavItem> */}
              <SubNavItem to="/employee-list">
                <FaUsers />
                {!isCollapsed && "Employee List"}
              </SubNavItem>
            </>
          )}

          <NavItem to="/holidays">
            <FaCalendarAlt />
            {!isCollapsed && "Holidays"}
          </NavItem>
          <NavItem to="/application-list">
            <FaRocket />
            {!isCollapsed && "Applications"}
          </NavItem>
          <NavItem to="#" onClick={(e) => toggleSubMenu("payroll", e)}>
            <FaRupeeSign />
            {!isCollapsed && "Payroll"}
          </NavItem>
          {expandedMenus.payroll && !isCollapsed && (
            <>
              <SubNavItem to="/salary-list">
                <FaUsers />
                Employee Salary List
              </SubNavItem>
              {/* <SubNavItem to="/payment">
                <FaMoneyCheck />
                Make Payment
              </SubNavItem> */}
            </>
          )}
          <NavItem to="/announcement">
            <FaBell />
            {!isCollapsed && "Announcements"}
          </NavItem>
        </NavMenu>
      </Sidebar>
    </ThemeProvider>
  );
};

export default React.memo(SidebarManager);
