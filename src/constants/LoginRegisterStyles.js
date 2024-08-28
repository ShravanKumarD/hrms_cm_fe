import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Link } from "react-router-dom";

export const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #ffa500, #ff6347);
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

`;

export const flowingMotion = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(5px) rotate(0.5deg);
  }
  50% {
    transform: translateY(0) rotate(-0.5deg);
  }
  75% {
    transform: translateY(-5px) rotate(0.25deg);
  }
`;

export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: 100vh; // Full viewport height
  width: 100%;
  position: relative;
  z-index: 1;
  animation: ${flowingMotion} 15s ease-in-out infinite;
  overflow: hidden;
`;

export const LoginBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 165, 0, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-height: 600px) {
    padding: 1rem;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LogoImage = styled.img`
  width: 200px;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  color: rgba(255, 255, 0, 1);
  text-align: center;
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  // font-family: "Helvetica Neue", Arial, sans-serif;

  @media (max-height: 600px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1rem;
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.5);
    background-color: white;
  }
`;

export const PasswordToggle = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #ffa500;
  user-select: none;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #ffa500, #ff6347);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const RegisterLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #ffa500;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6347;
    text-decoration: underline;
  }
`;

export const Footer = styled.p`
  margin-top: 1.5rem;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 0.9rem;
`;

export const BackgroundElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

export const EmpowermentContainer = styled.div`
  animation: ${flowingMotion} 7s linear infinite;
  border-radius: 20px;
  padding: 20px;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent;
  // background: linear-gradient(180deg, #1b9bdc, rgb(117.94, 208.84, 255) 54.51%, #1b9bdc);
  background: linear-gradient(
    135deg,
    #ffd700,
    #ffeb3b
  ); /* Updated to more yellowish colors */
  background-clip: text;
  color: transparent;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 20px;
  position: absolute; /* Change to absolute for positioning */
  bottom: 0; /* Start at the bottom */
  right: 0; /* Start at the right */
  transform: translate(
    -35%,
    -35%
  ); /* Ensures starting position is bottom right */
`;

export const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  background-color: ${(props) => props.color || "rgba(255, 255, 255, 0.1)"};
  width: ${(props) => props.size || "300px"};
  height: ${(props) => props.size || "300px"};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  animation: ${flowingMotion} ${({ intensity }) => intensity || 5}s ease-in-out
    infinite;
`;

export const Square = styled.div`
  position: absolute;
  background-color: ${(props) => props.color || "rgba(255, 255, 255, 0.1)"};
  width: ${(props) => props.size || "100px"};
  height: ${(props) => props.size || "100px"};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  transform: rotate(${(props) => props.rotate || "0deg"});
`;

export const Triangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: ${(props) => props.size || "50px"} solid transparent;
  border-right: ${(props) => props.size || "50px"} solid transparent;
  border-bottom: ${(props) => props.size || "100px"} solid
    ${(props) => props.color || "rgba(255, 255, 255, 0.1)"};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  transform: rotate(${(props) => props.rotate || "0deg"});
`;

export const Person = styled.div`
  position: absolute;
  width: 100px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 10%;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  animation: ${flowingMotion} ${({ intensity }) => intensity || 10}s ease-in-out
    infinite;
`;

export const FluidShape = styled.div`
  position: absolute;
  width: ${(props) => props.width || "200px"};
  height: ${(props) => props.height || "200px"};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
  opacity: ${(props) => props.opacity || 0.1};
  transform: rotate(${(props) => props.rotate || "0deg"});

  svg {
    width: 100%;
    height: 100%;
    fill: ${(props) => props.color || "rgba(255, 255, 255, 0.1)"};
  }

  animation: float 20s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) rotate(${(props) => props.rotate || "0deg"});
    }
    50% {
      transform: translateY(-20px) rotate(${(props) => props.rotate || "0deg"});
    }
  }
`;

export const Blob1 = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M43.1,-56.7C56.4,-50.5,67.6,-37.6,73.6,-22.5C79.5,-7.5,80.2,9.7,74.4,24.5C68.6,39.3,56.3,51.6,42.4,56.8C28.5,62,14.2,60.2,-2.6,63.7C-19.5,67.2,-38.9,76,-50,68.9C-61.2,61.8,-64.2,38.8,-65.7,19.7C-67.1,0.7,-67.1,-14.4,-60.6,-22.5C-54.2,-30.7,-41.4,-31.9,-30.3,-36.8C-19.3,-41.7,-9.6,-50.2,4.3,-56.5C18.2,-62.8,36.4,-66.9,43.1,-56.7Z"
      transform="translate(100 100)"
    />
  </svg>
);

export const Blob2 = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M34.7,-59.7C47.2,-53.4,59,-46.4,64.1,-36.3C69.2,-26.1,67.5,-13,61.5,-2.7C55.5,7.5,45.3,15,36.1,23.9C27,32.9,18.9,43.3,7.6,45.7C-3.8,48.2,-19.3,42.6,-32.3,35.7C-45.3,28.8,-55.9,20.7,-61.5,8.5C-67.2,-3.8,-67.8,-19.9,-61.5,-30.7C-55.2,-41.4,-42,-46.8,-29.4,-52.6C-16.8,-58.4,-8.4,-64.7,1.7,-67.3C11.8,-70,23.6,-69.1,34.7,-59.7Z"
      transform="translate(100 100)"
    />
  </svg>
);

export const Blob3 = () => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M44.8,-55.4C58.5,-49.2,68.7,-36.6,71,-23.3C73.2,-10,67.4,4,61.8,17.2C56.2,30.4,50.8,42.9,41.6,50.4C32.4,57.8,19.2,60.2,7.8,55.8C-3.6,51.4,-14.4,40.1,-26,32.3C-37.6,24.5,-50,20.2,-55.8,11.6C-61.5,3,-60.5,-9.8,-56.5,-23.1C-52.6,-36.3,-45.7,-49.9,-35,-56.6C-24.3,-63.3,-12.1,-63.1,0.7,-64.1C13.4,-65,26.8,-67.2,38.7,-62.4C50.7,-57.6,61.2,-45.9,63.8,-33.2C66.4,-20.4,61,-7.6,55.8,5.8C50.7,19.3,45.6,32.4,39.2,42.9C32.9,53.4,25.3,61.3,16.1,65.6C7,69.8,-2.8,70.4,-11.5,67.5C-20.2,64.7,-28,58.5,-35.4,51.2C-42.8,43.9,-49.8,35.5,-51.2,26.5C-52.6,17.4,-48.3,8.7,-42.7,1.8C-37.1,-5,-30.2,-10.9,-22.1,-16.6C-14,-22.3,-4.8,-27.9,3.8,-32.5C12.3,-37.1,20.1,-40.6,27.1,-43.1C34.2,-45.7,40.6,-47.2,44.8,-55.4Z"
      transform="translate(100 100)"
    />
  </svg>
);

// Define the swimming animation
// const swimmingAnimation = keyframes`
//   0% {
//     transform: translate(100%, 100%) rotate(0deg);
//   }
//   14% {
//     transform: translate(75%, 75%) rotate(3deg);
//   }
//   28% {
//     transform: translate(50%, 50%) rotate(-2deg);
//   }
//   42% {
//     transform: translate(25%, 25%) rotate(4deg);
//   }
//   57% {
//     transform: translate(0%, 0%) rotate(-3deg);
//   }
//   71% {
//     transform: translate(-25%, -25%) rotate(2deg);
//   }
//   85% {
//     transform: translate(-50%, -50%) rotate(-1deg);
//   }
//   100% {
//     transform: translate(-75%, -75%) rotate(0deg);
//   }
// `;
