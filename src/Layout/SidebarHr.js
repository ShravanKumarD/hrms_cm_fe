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
  FaSitemap,
  FaUser,
  FaFileAlt,
  FaRupeeSign,
  FaMoneyBill,
  FaBell,
  FaAngleLeft,
  FaCalendarAlt,
  FaBriefcase,
  FaList,
  FaPlus,
  FaUsers,
  FaBuilding,
  FaFileInvoiceDollar,
  FaFileSignature,
  FaFileExport,
  FaMoneyCheck,
  FaShoppingCart,
  FaFileInvoice,
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
          <NavItem to="#" onClick={() => toggleSubMenu("applications")}>
            <FaRocket />
            {!isCollapsed && "Applications"}
          </NavItem>
          {expandedMenus.applications && !isCollapsed && (
            <>
              <SubNavItem to="/application">
                <FaPlus />
                Add Application
              </SubNavItem>
              <SubNavItem to="/application-list">
                <FaList />
                Application List
              </SubNavItem>
            </>
          )}
  <NavItem to="#" onClick={() => toggleSubMenu("employee")}>
            <FaUser />
            {!isCollapsed && "Employee"}
          </NavItem>
          {expandedMenus.employee && !isCollapsed && (
            <>
              <SubNavItem to="/employee-list">
                <FaUsers />
                Employee List
              </SubNavItem>
            </>
          )}
 <NavItem to="#" onClick={() => toggleSubMenu("documents")}>
            <FaFileAlt />
            {!isCollapsed && "Documents"}
          </NavItem>
          {expandedMenus.documents && !isCollapsed && (
            <>
              <SubNavItem to="/salary-slip-list">
                <FaFileInvoiceDollar />
                Salary Slip
              </SubNavItem>
              <SubNavItem to="/offer-letter-list">
                <FaFileSignature />
                Offer Letter
              </SubNavItem>
              <SubNavItem to="/hike-letter-list">
                <FaFileAlt />
                Hike Letter
              </SubNavItem>
              <SubNavItem to="/relieving-letter-list">
                <FaFileExport />
                Relieving Letter
              </SubNavItem>
            </>
          )}
        <NavItem to="#" onClick={() => toggleSubMenu("payroll")}>
            <FaRupeeSign />
            {!isCollapsed && "Payroll"}
          </NavItem>
          {expandedMenus.payroll && !isCollapsed && (
            <>
              <SubNavItem to="/salary-details">
                <FaRupeeSign />
                Manage Salary Details
              </SubNavItem>
              <SubNavItem to="/salary-list">
                <FaUsers />
                Employee Salary List
              </SubNavItem>
              <SubNavItem to="/payment">
                <FaMoneyCheck />
                Make Payment
              </SubNavItem>
            </>
          )}
          <NavItem to="#" onClick={() => toggleSubMenu("expense")}>
            <FaMoneyBill />
            {!isCollapsed && "Expense"}
          </NavItem>
          {expandedMenus.expense && !isCollapsed && (
            <>
              <SubNavItem to="/expense">
                <FaShoppingCart />
                Make Expense
              </SubNavItem>
              <SubNavItem to="/expense-report">
                <FaFileInvoice />
                Expense Report
              </SubNavItem>
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

export default SidebarHr;
