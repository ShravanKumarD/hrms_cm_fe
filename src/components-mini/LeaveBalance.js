import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import moment from 'moment';
import axios from "axios";
import API_BASE_URL from "../env";

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
  color: ${(props) => props.theme.leaveTextColor};
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

let user = JSON.parse(localStorage.getItem("user"));

const LeaveBalanceContainer = ({ theme = "green" }) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [generalLeaves, setGenralLeaves] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  // const [sickLeaves, setSickLeaves] = useState(0);
  let sickLeaves=0;

  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;

    axios
      .get(`/api/applications/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const formattedApplications = res.data.map((app) => ({
          ...app,
          startDate: moment(app.startDate).format("Do MMM YYYY"),
          endDate: moment(app.endDate).format("Do MMM YYYY"),
        }));

        console.log(formattedApplications, "setLeaves");

        setTotalLeaves(formattedApplications.length);

        const totalapprovedlist = formattedApplications.filter((x) => {
          console.log(x,"total")
          return (
            x.status === "Approved" && !/sick|Sick|SICK|headache|stomach|fever|pain/i.test(x.reason) && x.type === "Comp Off" );
        });
        setGenralLeaves(totalapprovedlist.length);

        const totalSickleaves = formattedApplications.filter((x) => {
          return /sick|Sick|SICK|headache|stomach|fever|pain/i.test(x.reason || "") && x.status === "Approved" &&  x.type !== "Comp Off" &&
           x.type !=="Regularisation" && x.type !== "Work From Home" &&x.type !== "On duty" && x.type !== "Expense" && x.type!=="Ristricted Holiday" && x.type!=="Shroty"
        });
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
      });
  }, []);

  useEffect(() => {
    // Log the updated state value here
    console.log(generalLeaves, sickLeaves, "Updated leave counts");
  }, [generalLeaves, sickLeaves]);

  const leaveTypes = [
    { type: "Leave Balance", balance: totalLeaves+9, total: 12 },
    { type: "Paid Leave", balance: generalLeaves+8, total: 10 },
    { type: "Sick Leave", balance: sickLeaves+1, total: 2 },
  ];

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
