import React, { useState } from "react";
import { Container, Card } from "react-bootstrap";
import styled from "styled-components";

const LeaveContainer = styled.div`
  width: 100%;
  height: 150px;
  background: #8adcd2;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: #8adcd2;
    z-index: 0;
  }
`;

const LeaveScroll = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const LeaveCard = styled.div`
  min-width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LeaveTitle = styled.h3`
  margin: 0;
  padding-bottom: 10px;
  font-size: 18px;
  color: ${(props) => props.theme.leaveTextColor};//teext colour
  z-index: 1;
  position: relative;
`;

const LeaveBalance = styled.p`
  font-size: 36px;
  font-weight: bold;
  margin: 10px 0;
  color: ${(props) => props.theme.leaveTextColor};
`;

const SmallBalance = styled.span`
  font-size: 24px;
  opacity: 0.7;
`;

const Status = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${(props) => props.theme.leaveTextColor};
`;

const ScrollIndicator = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: ${(props) => props.theme.leaveTextColor};
  opacity: ${(props) => (props.visible ? "1" : "0")};
  transition: opacity 0.3s ease;
`;

const leaveTypes = [
  { type: "Leave Balance", balance: 23, total: 37 },
  { type: "Paid Leave", balance: 12, total: 12 },
  { type: "Privilege Leave", balance: 5, total: 10 },
  { type: "Casual Leave", balance: 3, total: 5 },
  { type: "Sick Leave", balance: 2, total: 7 },
  { type: "Comp-Off", balance: 1, total: 3 },
];

const LeaveBalanceContainer = ({ theme = "green" }) => {
  const [showIndicator, setShowIndicator] = useState(false);

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <div
        className="shadow-sm"
        style={{
          maxWidth: "400px",
          width: "100%",
          fontSize: theme.fontSize,
          borderRadius: "10px",
          background: theme.background,
        }}
      >
        <LeaveContainer
          theme={theme}
          onMouseEnter={() => setShowIndicator(true)}
          onMouseLeave={() => setShowIndicator(false)}
        >
          <LeaveScroll>
            {leaveTypes.map((leave, index) => (
              <LeaveCard key={index}>
                <LeaveTitle theme={theme}>{leave.type}</LeaveTitle>
                <LeaveBalance theme={theme}>
                  {leave.balance}
                  <SmallBalance>/{leave.total}</SmallBalance>
                </LeaveBalance>
                <Status theme={theme}>Currently Available</Status>
              </LeaveCard>
            ))}
          </LeaveScroll>
          <ScrollIndicator visible={showIndicator} theme={theme}>
            &gt;
          </ScrollIndicator>
        </LeaveContainer>
      </div>
    </Container>
  );
};

export default LeaveBalanceContainer;
