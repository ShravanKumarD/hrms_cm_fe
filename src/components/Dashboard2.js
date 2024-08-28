import React, { useEffect, useState } from "react";
import axios from "axios";
import Infobox from "./infobox";
import TimesheetMini from "../components-mini/TimesheetMini";
import ExpenseChartsPage from "./ExpenseChartsPage";
import PaymentChartsPage from "./PaymentChartsPage";
import RecentApplications from "./RecentApplications";
import RecentAnnouncements from "./RecentAnnouncements";
import LightweightStartWork from "../components-mini/LightweightStartWork";
import HoursWorkedLastWeek from "../components-mini/HoursWorkedLastWeek";
import styled, { ThemeProvider } from "styled-components";

const themes = {
  orange: {
    primary: "#FF8C00",
    secondary: "#FF8C00",
    text: "#FFFFFF",
    background: "#FFFFFF",
    hover: "#FFFF00",
    iconDefault: "#FFFFFF",
    iconHover: "#FFFF00",
    textActive: "#FFFF00",
    selectedBorder: "#FFFF00",
    panelBackground: "#F8F9FA", // Added
    panelBorderColor: "#E0E0E0", // Added
    infoboxBackground: "#FFFFFF", // Added
  },
  blue: {
    primary: "#0066CC",
    secondary: "#0099FF",
    text: "#FFFFFF",
    background: "#FFFFFF",
    hover: "#33CCFF",
    iconDefault: "#FFFFFF",
    iconHover: "#33CCFF",
    textActive: "#33CCFF",
    selectedBorder: "#33CCFF",
    panelBackground: "#F0F4F8", // Added
    panelBorderColor: "#D0D0D0", // Added
    infoboxBackground: "#FFFFFF", // Added
  },
  green: {
    primary: "#006633",
    secondary: "#006633",
    text: "#FFFFFF",
    background: "#FFFFFF",
    hover: "#00CC66",
    iconDefault: "#FFFFFF",
    iconHover: "#00CC66",
    textActive: "#00CC66",
    selectedBorder: "#00CC66",
    panelBackground: "#E8F5E9", // Added
    panelBorderColor: "#C8E6C9", // Added
    infoboxBackground: "#FFFFFF", // Added
  },
};

const DashboardWrapper = styled.div`
  background-color: ${(props) => props.theme.background};
  padding: 20px;
  border-radius: 10px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
`;

const Col = styled.div`
  padding: 10px;
  flex: ${(props) => (props.size ? `0 0 ${props.size}%` : "0 0 100%")};
  max-width: ${(props) => (props.size ? `${props.size}%` : "100%")};
`;

const Panel = styled.div`
  background-color: ${(props) => props.theme.panelBackground};
  border: 1px solid ${(props) => props.theme.panelBorder};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
`;

const InfoboxWrapper = styled.div`
  background-color: ${(props) => props.theme.infoboxBackground};
  color: ${(props) => props.theme.infoboxText};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoboxIcon = styled.i`
  font-size: 2rem;
`;

const InfoboxContent = styled.div`
  text-align: right;
`;

const InfoboxTitle = styled.h4`
  margin: 0;
  font-weight: bold;
`;

const InfoboxDescription = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: lighter;
`;

const Dashboard = ({ themeKey = "green" }) => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const { data } = await axios.get("/api/users/total", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTotalEmployees(parseInt(data));
      } catch (err) {
        console.error("Error fetching total employees:", err);
      }
    };

    const fetchTotalExpenses = async () => {
      try {
        const { data } = await axios.get("/api/expenses/year/2024", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.length > 0) {
          const total = data.reduce(
            (sum, item) => sum + parseInt(item.expenses),
            0
          );
          setTotalExpenses(total);
        }
      } catch (err) {
        console.error("Error fetching total expenses:", err);
      }
    };

    const fetchTotalPayments = async () => {
      try {
        const { data } = await axios.get("/api/payments/year/2024", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.length > 0) {
          const total = data.reduce(
            (sum, item) => sum + parseInt(item.expenses),
            0
          );
          setTotalPayments(total);
        }
      } catch (err) {
        console.error("Error fetching total payments:", err);
      }
    };

    fetchTotalEmployees();
    fetchTotalExpenses();
    fetchTotalPayments();
  }, []);

  return (
    <ThemeProvider theme={themes[themeKey]}>
      <DashboardWrapper theme={themes[themeKey]}>
        <Row>
          <Col size={66}>
            <Panel>
              <TimesheetMini />
            </Panel>
          </Col>
          <Col size={33}>
            <Panel>
              <LightweightStartWork />
            </Panel>
            <Panel>
              <HoursWorkedLastWeek />
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col size={33}>
            <InfoboxWrapper>
              <InfoboxIcon className="fa fa-users" />
              <InfoboxContent>
                <InfoboxTitle>Total Employees</InfoboxTitle>
                <InfoboxDescription>{totalEmployees}</InfoboxDescription>
              </InfoboxContent>
            </InfoboxWrapper>
          </Col>
          <Col size={33}>
            <InfoboxWrapper>
              <InfoboxIcon className="fa fa-shopping-cart" />
              <InfoboxContent>
                <InfoboxTitle>Total Expenses</InfoboxTitle>
                <InfoboxDescription>₹{totalExpenses}</InfoboxDescription>
              </InfoboxContent>
            </InfoboxWrapper>
          </Col>
          <Col size={33}>
            <InfoboxWrapper>
              <InfoboxIcon className="fa fa-money-check" />
              <InfoboxContent>
                <InfoboxTitle>Total Payments</InfoboxTitle>
                <InfoboxDescription>₹{totalPayments}</InfoboxDescription>
              </InfoboxContent>
            </InfoboxWrapper>
          </Col>
        </Row>

        <Row>
          <Col size={50}>
            <Panel>
              <ExpenseChartsPage />
            </Panel>
          </Col>
          <Col size={50}>
            <Panel>
              <PaymentChartsPage />
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col size={50}>
            <Panel>
              <RecentApplications />
            </Panel>
          </Col>
          <Col size={50}>
            <Panel>
              <RecentAnnouncements />
            </Panel>
          </Col>
        </Row>
      </DashboardWrapper>
    </ThemeProvider>
  );
};

export default Dashboard;
