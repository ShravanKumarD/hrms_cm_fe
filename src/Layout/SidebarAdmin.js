import React, { useState, useEffect, useCallback } from "react";
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
  FaHollyBerry,
  FaCalendarAlt, FaUserClock 
} from "react-icons/fa";
import LogoWhite from "../assets/samcintlogowhite.png";
import LogoMini from "../assets/10.png";
import { useHistory } from "react-router-dom";

// Define your theme
const theme = {
  primary: "#27ae60",
  secondary: "#27ae60",
  active: "#1e8449",
  hover: "rgba(255, 255, 255, 0.2)",
  // text: "#FFFFFF",
  text:"#00000",
  scrollbarThumb: "rgba(255, 255, 255, 0.3)",
  scrollbarTrack: "rgba(255, 255, 255, 0.1)",
};

// Styled components
const Sidebar = styled.aside`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  height: 70vh;
  width: ${(props) => (props.isCollapsed ? "70px" : "250px")};
  background: #8adcd2;;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
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
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  backdrop-filter: blur(10px);

  /* Scrollbar Styles */
  scrollbar-width: none;
    &:hover {
    &::-webkit-scrollbar {
      width: 8px;
    }
  scrollbar-color: ${(props) => props.theme.scrollbarThumb} ${(props) => props.theme.scrollbarTrack};

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
    scrollbar-color: ${(props) => props.theme.scrollbarThumb} ${(props) =>
  props.theme.scrollbarTrack};
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  color: ${(props) => props.theme.text};
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.hover};
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

const SidebarAdmin = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const history = useHistory();

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
    if (onToggle) {
      onToggle(newState);
    }
  }, [isCollapsed, onToggle]);

  const toggleSubMenu = useCallback((menu) => {
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
          <StyledLogo
            src={isCollapsed ? LogoMini : LogoWhite}
            alt="Company Logo"
          />
        </LogoContainer>
        <NavMenu>
          <NavItem onClick={() => {history.push("/") }}>
            <FaTachometerAlt />
            {!isCollapsed && "Dashboard"}
          </NavItem>
          <NavItem onClick={() => toggleSubMenu("attendance")}>
            <FaCalendarCheck />
            {!isCollapsed && "Attendance"}
          </NavItem>
          {
            expandedMenus.attendance && !isCollapsed && (
              <>
              <SubNavItem  onClick={() => { history.push("/attendance-list")}}>
                <FaCalendarCheck />
                Attendance Status
              </SubNavItem>
              <SubNavItem  onClick={() => { history.push("/attendance-list-detailed")}}>
                <FaList/>
                Attendance Overview
                </SubNavItem>
                              </>
            )
          }
          <NavItem onClick={() => toggleSubMenu("applications")}>
            <FaRocket />
            {!isCollapsed && "Applications"}
          </NavItem>
          {expandedMenus.applications && !isCollapsed && (
            <>
              <SubNavItem onClick={() => { history.push("/application-list")}}>
                <FaList />
                Application List
              </SubNavItem>
            </>
          )}
           
         <NavItem onClick={() => toggleSubMenu("holidays")}>
         <FaCalendarAlt />
         {!isCollapsed && "Holidays"}
       </NavItem>
       {expandedMenus.holidays && !isCollapsed &&(
        <>
            <SubNavItem onClick={() => { history.push("/holidays")}}>
            <FaCalendarAlt />
          General Holidays
          </SubNavItem>
           <SubNavItem onClick={() => { history.push("/personal-leaves")}}>
           <FaUserClock/>
         Employees' Leaves
         </SubNavItem>
         </>
      )}
          <NavItem onClick={() => toggleSubMenu("departments")}>
            <FaSitemap />
            {!isCollapsed && "Departments"}
          </NavItem>
          {expandedMenus.departments && !isCollapsed && (
            <>
              <SubNavItem onClick={() => { history.push("/departments")}}>
                <FaBuilding />
                Department List
              </SubNavItem>
              <SubNavItem onClick={() => { history.push("/job-list")}}>
                <FaBriefcase />
                Job List
              </SubNavItem>
            </>
          )}
          <NavItem onClick={() => toggleSubMenu("employee")}>
            <FaUser />
            {!isCollapsed && "Employee"}
          </NavItem>
          {expandedMenus.employee && !isCollapsed && (
            <>
              <SubNavItem onClick={() => { history.push("/employee-add")}}>
                <FaPlus />
                Add Employee
              </SubNavItem>
              <SubNavItem onClick={() => { history.push("/employee-list")}}>
                <FaUsers />
                Employee List
              </SubNavItem>
            </>
          )}
          <NavItem onClick={() => toggleSubMenu("documents")}>
            <FaFileAlt />
            {!isCollapsed && "Documents"}
          </NavItem>
          {expandedMenus.documents && !isCollapsed && (
            <>
              <SubNavItem onClick={() => { history.push("/salary-slip-list")}}>
                <FaFileInvoiceDollar />
                Salary Slip
              </SubNavItem >
              <SubNavItem onClick={() => { history.push("/offer-letter-list")}}>
                <FaFileSignature />
                Offer Letter
              </SubNavItem>
              <SubNavItem onClick={() => { history.push("/hike-letter-list")}}>
                <FaFileAlt />
                Hike Letter
              </SubNavItem>
              <SubNavItem onClick={() => { history.push("/relieving-letter-list")}}>
                <FaFileExport />
                Relieving Letter
              </SubNavItem>
            </>
          )}
          <NavItem onClick={() => toggleSubMenu("payroll")}>
            <FaRupeeSign />
            {!isCollapsed && "Payroll"}
          </NavItem>
          {expandedMenus.payroll && !isCollapsed && (
            <>
              <SubNavItem onClick={() => { history.push("/salary-details")}}>
                <FaRupeeSign />
                Manage Salary Details
              </SubNavItem>
              <SubNavItem onClick={() => { history.push("/salary-list")}}>
                <FaUsers />
                Employee Salary List
              </SubNavItem>
              <SubNavItem onClick={() => { history.push("/payment")}}>
                <FaMoneyCheck />
                Make Payment
              </SubNavItem>
            </>
          )}
          {/* <NavItem onClick={() => toggleSubMenu("expense")}>
            <FaMoneyBill />
            {!isCollapsed && "Expense"}
          </NavItem>
          {expandedMenus.expense && !isCollapsed && (
            <>
              <SubNavItem onClick={() => { history.push("/expense")}}>
                <FaShoppingCart />
                Make Expense
              </SubNavItem>
              <SubNavItem onClick={() => { history.push("/expense-report")}}>
                <FaFileInvoice />
                Expense Report
              </SubNavItem>
            </>
          )} */}
          <NavItem onClick={() => { history.push("/announcement") }}>
            <FaBell />
            {!isCollapsed && "Announcements"}
          </NavItem>
        </NavMenu>
      </Sidebar>
    </ThemeProvider>
  );
};

export default React.memo(SidebarAdmin);
