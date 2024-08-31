import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../../env";

const theme = {
  colors: {
    primary: "#004d00",
    secondary: "#007a00",
    background: "#ffffff",
    text: "#333333",
    lightText: "#666666",
    cardHeader: "#006400",
    cardBody: "#e0ffe0",
  },
  gradients: {
    primary: "linear-gradient(135deg, #004d00 0%, #007a00 100%)",
    secondary: "linear-gradient(135deg, #002200 0%, #004d00 100%)",
    cardHeader: "linear-gradient(135deg, #4CAF4F 0%, #85E184 100%)",
  },
  fontSizes: {
    small: "0.875rem",
    medium: "1rem",
    large: "1.25rem",
    xlarge: "1.5rem",
  },
};

const Card = ({ title, children, extraContent }) => (
  <div
    style={{
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginBottom: "1.5rem",
      overflow: "hidden",
      backgroundColor: theme.colors.background,
      height: "100%",
    }}
  >
    <div
      style={{
        background: theme.gradients.cardHeader,
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3
        style={{
          fontSize: theme.fontSizes.large,
          fontWeight: "bold",
          color: theme.colors.background,
          margin: 0,
        }}
      >
        {title}
      </h3>
      {extraContent}
    </div>
    <div
      style={{
        background: theme.colors.cardBody,
        padding: "1rem",
        height: "calc(100% - 3.5rem)",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  </div>
);

const DataItem = ({ label, value }) => (
  <p style={{ margin: "0.5rem 0" }}>
    <span
      style={{
        fontSize: theme.fontSizes.small,
        color: theme.colors.lightText,
        display: "block",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: theme.fontSizes.medium,
        color: theme.colors.text,
        fontWeight: "500",
      }}
    >
      {value || "N/A"}
    </span>
  </p>
);

const EmployeeDashboard = () => {
  const [userData, setUserData] = useState({
    user: {},
    department: { departmentName: null },
    job: { jobTitle: null },
    userPersonalInfo: {},
    userFinancialInfo: {},
  });

  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/users/${
            JSON.parse(localStorage.getItem("user")).id
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const currentJob = data.jobs?.find(
          (job) =>
            new Date(job.startDate) <= Date.now() &&
            new Date(job.endDate) >= Date.now()
        );

        setUserData({
          user: data,
          department: data.department || {},
          job: currentJob || {},
          userPersonalInfo: {
            ...data.user_personal_info,
            dateOfBirth: data.user_personal_info?.dateOfBirth
              ? moment(data.user_personal_info.dateOfBirth).format("D MMM YYYY")
              : null,
          },
          userFinancialInfo: data.user_financial_info || {},
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        history.push("/error");
      }
    };

    fetchUserData();
  }, [history]);

  const { user, department, job, userPersonalInfo, userFinancialInfo } =
    userData;

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      <h1
        style={{
          fontSize: theme.fontSizes.xlarge,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          background: theme.gradients.primary,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Employee Dashboard
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ flex: "1 1 100%", minWidth: "300px" }}>
          <Card title="Profile">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: theme.gradients.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: theme.fontSizes.xlarge,
                  fontWeight: "bold",
                }}
              >
                {user.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: theme.fontSizes.large,
                    fontWeight: "bold",
                    margin: "0 0 0.5rem 0",
                    color: theme.colors.text,
                  }}
                >
                  {user.fullName}
                </h2>
                <p
                  style={{ color: theme.colors.lightText, margin: "0 0 0.25rem 0" }}
                >
                  {job.jobTitle}
                </p>
                <p
                  style={{
                    fontSize: theme.fontSizes.small,
                    color: theme.colors.lightText,
                    margin: 0,
                  }}
                >
                  {department.departmentName}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ flex: "1 1 calc(50% - 0.75rem)", minWidth: "300px" }}>
          <Card title="Work Information">
            <DataItem label="Employee ID" value={user.id} />
            <DataItem label="Department" value={department.departmentName} />
            <DataItem label="Job Title" value={job.jobTitle} />
            <DataItem
              label="Role"
              value={
                user.role === "ROLE_ADMIN"
                  ? "Admin"
                  : user.role === "ROLE_MANAGER"
                  ? "Manager"
                  : "Employee"
              }
            />
          </Card>
        </div>

        <div style={{ flex: "1 1 calc(50% - 0.75rem)", minWidth: "300px" }}>
          <Card title="Personal Details">
            <DataItem label="Date of Birth" value={userPersonalInfo.dateOfBirth} />
            <DataItem label="Gender" value={userPersonalInfo.gender} />
            <DataItem
              label="Marital Status"
              value={userPersonalInfo.maritalStatus}
            />
            <DataItem label="Father's Name" value={userPersonalInfo.fatherName} />
          </Card>
        </div>

        <div style={{ flex: "1 1 calc(50% - 0.75rem)", minWidth: "300px" }}>
          <Card title="Contact Details">
            <DataItem
              label="Location"
              value={`${userPersonalInfo.country}, ${userPersonalInfo.city}`}
            />
            <DataItem label="Address" value={userPersonalInfo.address} />
            <DataItem
              label="Mobile"
              value={`${userPersonalInfo.mobile} ${
                userPersonalInfo.phone ? `(${userPersonalInfo.phone})` : ""
              }`}
            />
            <DataItem label="Email Address" value={userPersonalInfo.emailAddress} />
          </Card>
        </div>

        <div style={{ flex: "1 1 calc(50% - 0.75rem)", minWidth: "300px" }}>
          <Card title="Bank Information">
            <DataItem label="Bank Name" value={userFinancialInfo.bankName} />
            <DataItem label="Account Name" value={userFinancialInfo.accountName} />
            <DataItem
              label="Account Number"
              value={userFinancialInfo.accountNumber}
            />
            <DataItem label="IBAN" value={userFinancialInfo.iban} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;