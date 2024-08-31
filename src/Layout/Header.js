import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import styled, { ThemeProvider, keyframes, css } from "styled-components";
import NewPasswordModal from "../components/NewPasswordModal";
import GlobalStyle from "../constants/GlobalStyleSidebar";

// Updated theme with warm green steel colors
const theme = {
  primary: "#2c5e1a",
  secondary: "#4a8c34",
  tertiary: "#76b852",
  text: "#e0e0e0",
  hover: "#8ed160",
  fontSize: "14px",
  padding: "12px 16px",
};

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px ${theme.tertiary}40, 0 0 10px ${theme.tertiary}40, 0 0 15px ${theme.tertiary}40; }
  50% { box-shadow: 0 0 10px ${theme.tertiary}60, 0 0 20px ${theme.tertiary}60, 0 0 30px ${theme.tertiary}60; }
  100% { box-shadow: 0 0 5px ${theme.tertiary}40, 0 0 10px ${theme.tertiary}40, 0 0 15px ${theme.tertiary}40; }
`;

const HeaderWrapper = styled.nav`
  background: linear-gradient(
    135deg,
    ${theme.primary} 0%,
    ${theme.secondary} 50%,
    ${theme.tertiary} 100%
  );
  color: ${theme.text};
  display: flex;
  justify-content: space-between;
  padding: 15px 30px;
  position: relative;
  z-index: 1000;
  border-bottom: 1px solid ${theme.tertiary};
  border-radius: 20px 20px 20px 20px;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;

  animation: ${glowAnimation} 3s infinite;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${theme.primary}80 0%,
      ${theme.secondary}80 50%,
      ${theme.tertiary}80 100%
    );
    filter: blur(10px);
    opacity: 0.7;
    z-index: -1;
  }
`;

const NavItem = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const NavLink = styled.a`
  color: ${theme.text};
  margin-right: 20px;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, transform 0.3s ease, text-shadow 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    color: ${theme.hover};
    transform: translateY(-2px);
    text-shadow: 0 0 10px ${theme.hover}, 0 0 20px ${theme.hover},
      0 0 30px ${theme.hover};
  }

  i {
    margin-right: 8px;
  }
`;

const DropdownMenu = styled.div`
  background: linear-gradient(
    135deg,
    ${theme.primary}E6 0%,
    ${theme.secondary}E6 100%
  );
  color: ${theme.text};
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid ${theme.tertiary};
  position: absolute;
  top: 120%;
  right: 20px;
  min-width: 220px;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  font-size: ${theme.fontSize};
  z-index: 1001;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const DropdownItem = styled.a`
  padding: ${theme.padding};
  color: ${theme.text};
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  font-size: ${theme.fontSize};
  margin: 0;

  &:hover {
    background-color: ${theme.hover}40;
    color: ${theme.text};
    transform: translateX(5px);
    box-shadow: inset 0 0 10px ${theme.hover}60;
  }

  i {
    margin-right: 12px;
  }
`;

const Header = () => {
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
            <li className="nav-item">
              <NavLink href="#" onClick={toggleDropdown}>
                <i className="fas fa-user" />
                <span className="pl-1">
                  {JSON.parse(localStorage.getItem("user")).fullname}
                </span>
              </NavLink>
              <DropdownMenu show={dropdownOpen}>
                <DropdownItem onClick={newPassword} href="#">
                  <i className="fas fa-key" /> Change Password
                </DropdownItem>
                <DropdownItem onClick={onLogout} href="#">
                  <i className="fas fa-sign-out-alt" /> Log out
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
