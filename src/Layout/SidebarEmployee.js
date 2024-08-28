import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { NavLink } from "react-router-dom";
import { loadTree } from "../menuTreeHelper";
import TodaysWorkStatus from "../components-mini/TodaysWorkStatus";
import Logo from "../assets/samcint_logo_2.png";
import LogoMini from "../assets/10.png";
import GlobalStyle from "../constants/GlobalStyleSidebar";
import themes from "../constants/themes";

// Styled components with theme-based colors
const SidebarWrapper = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${(props) =>
    props.isPushed ? props.theme.secondary : props.theme.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  width: ${(props) => (props.isPushed ? "70px" : "250px")};
  overflow-y: hidden;
  overflow-x: hidden;
  border-right: 3px solid ${(props) => props.theme.primary};
  z-index: 1001; // Increased z-index
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  background-color: ${(props) => props.theme.primary};
  transition: background-color 0.3s ease;
  height: 80px; // Fixed height for logo container
`;

const StyledLogo = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const SidebarContent = styled.div`
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${(props) => props.theme.text};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const UserPanel = styled.div`
  background-color: ${(props) => props.theme.secondary};
  padding: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const UserImage = styled.img`
  border: 2px solid ${(props) => props.theme.primary};
  display: ${(props) => (props.isPushed ? "none" : "block")};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.a`
  color: ${(props) => props.theme.text};
  font-weight: bold;
  display: ${(props) => (props.isPushed ? "none" : "block")};
  &:hover {
    color: ${(props) => props.theme.hover};
  }
`;

const NavMenu = styled.nav`
  flex-grow: 1;
  overflow-y: auto;

  .nav-link {
    color: ${(props) => props.theme.text};
    padding: 10px 15px;
    display: flex;
    align-items: center;
    transition: color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease;
    text-decoration: none;
    border-radius: 4px;
    position: relative; // For the selection line

    &:hover,
    &.active {
      background-color: rgba(255, 255, 255, 0.1);
      color: ${(props) => props.theme.hover};

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: ${(props) => props.theme.selectedBorder};
      }

      .nav-icon {
        color: ${(props) => props.theme.iconHover};
      }

      p {
        color: ${(props) => props.theme.hover};
        i {
          color: ${(props) => props.theme.iconHover};
        }
      }
    }
  }

  .nav-treeview {
    .nav-link {
      padding-left: 30px;
    }
  }

  .nav-icon {
    color: ${(props) => props.theme.iconDefault};
    margin-right: 10px;
  }
`;

const SidebarEmployee = ({ onToggle, themeKey = "green" }) => {
  const [user, setUser] = useState({});
  const [isPushed, setIsPushed] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const theme = themes[themeKey];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData || {});
    loadTree();
  }, []);

  const toggleSidebar = () => {
    const newIsPushed = !isPushed;
    setIsPushed(newIsPushed);
    if (onToggle) onToggle(!newIsPushed);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SidebarWrapper isPushed={isPushed}>
        <LogoContainer onClick={toggleSidebar} data-widget="pushmenu">
          <StyledLogo src={isPushed ? LogoMini : Logo} alt="company-logo" />
        </LogoContainer>
        <SidebarContent>
          <UserPanel>
            <UserImage
              isPushed={isPushed}
              src={`${process.env.PUBLIC_URL}/user-64.png`}
              alt="User"
            />
            <UserInfo isPushed={isPushed} href="#">
              {user.fullname}
            </UserInfo>
          </UserPanel>
          <NavMenu>
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
                    <span className="right badge badge-warning">Home</span>
                  </p>
                </NavLink>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="active"
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
                      <TodaysWorkStatus isPushed={isPushed} userId={userId} />
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item has-treeview">
                <NavLink
                  to="/fake-url"
                  className="nav-link"
                  activeClassName="active"
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
          </NavMenu>
        </SidebarContent>
      </SidebarWrapper>
    </ThemeProvider>
  );
};

export default SidebarEmployee;
