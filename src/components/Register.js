import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../env";
import Logo from "../assets/samcint_logo_2.png";
import {
  GlobalStyle,
  CenteredContainer,
  LoginBox,
  LogoContainer,
  LogoImage,
  InputGroup,
  Input,
  PasswordToggle,
  LoginButton,
  RegisterLink,
  Footer,
  BackgroundElements,
  FluidShape,
  Blob1,
  Blob2,
  Blob3,
  Circle,
  Person,
  EmpowermentContainer,
} from "../constants/LoginRegisterStyles";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    checkPassword: "",
    fullname: "",
  });
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordCheckShow, setPasswordCheckShow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.checkPassword) {
      setHasError(true);
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      axios.defaults.baseURL = API_BASE_URL;
      await axios.post("/register", formData);
      setCompleted(true);
    } catch (err) {
      setHasError(true);
      setErrorMessage(err.response.data.message);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShow((prev) => !prev);
  };

  const togglePasswordCheckVisibility = () => {
    setPasswordCheckShow((prev) => !prev);
  };

  if (completed) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <GlobalStyle />
      <CenteredContainer>
        <LoginBox>
          <LogoContainer>
            <LogoImage src={Logo} alt="Samcint Logo" />
          </LogoContainer>
          <form onSubmit={handleSubmit}>
            {hasError && <Alert variant="danger">{errorMessage}</Alert>}
            <InputGroup>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Input
                type={passwordShow ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggle onClick={togglePasswordVisibility}>
                {passwordShow ? "Hide" : "Show"}
              </PasswordToggle>
            </InputGroup>
            <InputGroup>
              <Input
                type={passwordCheckShow ? "text" : "password"}
                name="checkPassword"
                placeholder="Retype Password"
                value={formData.checkPassword}
                onChange={handleChange}
                required
              />
              <PasswordToggle onClick={togglePasswordCheckVisibility}>
                {passwordCheckShow ? "Hide" : "Show"}
              </PasswordToggle>
            </InputGroup>
            <LoginButton type="submit">Register</LoginButton>
          </form>
          <RegisterLink to="/login">
            Already have an account? Login
          </RegisterLink>
          <Footer>© 2024 Samcint Solutions</Footer>
        </LoginBox>
      </CenteredContainer>

      <BackgroundElements>
        {/* Background shapes similar to those in Login */}
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
        <Person />
        <EmpowermentContainer>
          Empower your workforce in hours, not days.
        </EmpowermentContainer>
      </BackgroundElements>
    </>
  );
};

export default Register;
