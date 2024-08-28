import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import NewPasswordModal from "../components/NewPasswordModal";
import GlobalStyle from "../constants/GlobalStyleSidebar";
import themes from "../constants/themes";

// Styled components for the Header
const HeaderWrapper = styled.nav`
  background-color: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
`;

const NavItem = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const NavLink = styled.a`
  color: ${(props) => props.theme.text};
  margin-right: 20px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.hover};
  }

  i {
    margin-right: 8px;
  }
`;

const DropdownMenu = styled.div`
  background-color: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  display: none;
  flex-direction: column;
  font-size: ${(props) =>
    props.theme.fontSize}; /* Manage font size centrally */
  z-index: 1001;

  ${NavItem}:hover & {
    display: flex;
  }

  .dropdown-header {
    color: ${(props) => props.theme.text};
    padding: ${(props) => props.theme.padding};
    margin: 0;
    font-weight: bold;
  }
`;

const DropdownItem = styled.a`
  padding: ${(props) => props.theme.padding}; /* Use padding from theme */
  color: ${(props) => props.theme.text};
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: ${(props) => props.theme.fontSize}; /* Use font size from theme */
  margin: 0; /* Ensure margins are consistent */

  &:hover {
    background-color: ${(props) => props.theme.hover};
    color: ${(props) =>
      props.theme.text}; /* Ensure text color remains readable */
  }

  i {
    margin-right: 8px;
  }
`;

const Header = ({ themeKey = "green" }) => {
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = themes[themeKey];

  const onLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCompleted(true);
  };

  const newPassword = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <HeaderWrapper>
          {completed ? <Redirect to="/login" /> : null}
          {showModal ? (
            <NewPasswordModal show={true} onHide={closeModal} />
          ) : null}

          <NavItem>{/* Other left-aligned nav items can go here */}</NavItem>

          <NavItem>
            <li className="nav-item dropdown">
              <NavLink href="#" data-toggle="dropdown">
                <i className="fas fa-user" />
                <span className="pl-1">
                  {JSON.parse(localStorage.getItem("user")).fullname}
                </span>
              </NavLink>
              <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span className="dropdown-header">Options</span>
                <div className="dropdown-divider" />
                <DropdownItem onClick={newPassword} href="#">
                  <i className="fas fa-key mr-2" /> Change Password
                </DropdownItem>
                <div className="dropdown-divider" />
                <DropdownItem onClick={onLogout} href="#">
                  <i className="fas fa-sign-out-alt mr-2" /> Log out
                </DropdownItem>
              </DropdownMenu>
            </li>
          </NavItem>
        </HeaderWrapper>
      </ThemeProvider>
    </>
  );
};

export default Header;
