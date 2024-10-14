import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import API_BASE_URL from "../env";
import Logo from "../assets/samcint_logo_2.png";
import {
  GlobalStyle,
  CenteredContainer,
  LoginBox,
  LogoContainer,
  LogoImage,
  Title,
  InputGroup,
  Input,
  PasswordToggle,
  LoginButton,
  RegisterLink,
  Footer,
  BackgroundElements,
  Circle,
  Square,
  Triangle,
  Blob1,
  Blob2,
  Blob3,
  Person,
  FluidShape,
  EmpowermentContainer,
} from "../constants/LoginRegisterStyles";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [done, setDone] = useState(false);

  const passwordVisibilityHandler = () => {
    setPasswordShow(!passwordShow);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const user = { username, password };
    try {
      axios.defaults.baseURL = API_BASE_URL;
      const res = await axios.post("/login", user);
        .setItem("token", res.data.token);
      setDone(true);
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "An unexpected error occurred";
      setHasError(true);
      setErrorMessage(errorMsg);
    }
  };

  if (done) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <GlobalStyle />
      <CenteredContainer>
        <LoginBox>
          <LogoContainer>
            <LogoImage src={Logo} alt="Samcint Logo" />
          </LogoContainer>
          <form onSubmit={onSubmit}>
            {hasError && <Alert variant="danger">{errorMessage}</Alert>}
            <InputGroup>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Input
                type={passwordShow ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordToggle onClick={passwordVisibilityHandler}>
                {passwordShow ? "Hide" : "Show"}
              </PasswordToggle>
            </InputGroup>
            <LoginButton type="submit">Login</LoginButton>
          </form>
          <RegisterLink to="/register">
            New here? Create an account
          </RegisterLink>
          <Footer>© 2024 Samcint Solutions</Footer>
        </LoginBox>
      </CenteredContainer>

      <BackgroundElements>
        <FluidShape
          width="400px"
          height="400px"
          top="-100px"
          right="-100px"
          color="rgba(255, 165, 0, 0.1)"
          rotate="30deg"
        >
          <Blob1 />
        </FluidShape>
        <FluidShape
          width="300px"
          height="300px"
          top="20%"
          left="5%"
          color="rgba(255, 99, 71, 0.08)"
          rotate="-15deg"
        >
          <Blob2 />
        </FluidShape>
        <FluidShape
          width="250px"
          height="250px"
          bottom="10%"
          right="15%"
          color="rgba(255, 255, 255, 0.1)"
          rotate="45deg"
        >
          <Blob3 />
        </FluidShape>
        <FluidShape
          width="200px"
          height="200px"
          top="40%"
          left="20%"
          color="rgba(255, 165, 0, 0.08)"
          rotate="60deg"
        >
          <Blob1 />
        </FluidShape>
        <FluidShape
          width="150px"
          height="150px"
          bottom="25%"
          left="10%"
          color="rgba(255, 99, 71, 0.1)"
          rotate="-30deg"
        >
          <Blob2 />
        </FluidShape>

        <Circle
          size="300px"
          color="rgba(255, 255, 255, 0.1)"
          top="-100px"
          right="-100px"
        />
        <Circle
          size="200px"
          color="rgba(255, 165, 0, 0.1)"
          top="20%"
          left="10%"
        />
        <Circle
          size="150px"
          color="rgba(255, 99, 71, 0.1)"
          bottom="15%"
          right="20%"
        />
        {/* <Square size="120px" color="rgba(255, 255, 255, 0.08)" top="40%" left="5%" rotate="45deg" />
        <Square size="80px" color="rgba(255, 165, 0, 0.08)" bottom="10%" left="30%" rotate="30deg" /> */}
        {/* <Triangle size="80px" color="rgba(255, 99, 71, 0.08)" top="60%" right="5%" rotate="180deg" />
        <Triangle size="60px" color="rgba(255, 255, 255, 0.08)" bottom="20%" left="15%" rotate="45deg" />
        <Triangle size="100px" color="rgba(255, 165, 0, 0.08)" top="80%" right="10%" rotate="90deg" /> */}
        <Person />
        <EmpowermentContainer>
          Empower your workforce in hours, not days.
        </EmpowermentContainer>
      </BackgroundElements>
    </>
  );
};

export default Login;
