import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "styled-components";
import {
  DashboardContainer,
  DashboardTitle,
  CardContainer,
  CardHeader,
  CardTitle,
  CardBody,
  DataItemContainer,
  DataItemLabel,
  DataItemValue,
  ProfileContainer,
  ProfileImage,
  ProfileDetails,
  FlexContainer,
  FlexItem,
  theme, // Import the theme
} from "./EmployeeStyledComponents"; // Assuming EmployeeStyledComponents is in the same directory
import API_BASE_URL from "../../env";

const SalaryViewEmployee = () => {
  const [user, setUser] = useState(null);
  const [currentJobTitle, setCurrentJobTitle] = useState(null);
  const [falseRedirect, setFalseRedirect] = useState(false);
  const [editRedirect, setEditRedirect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = JSON.parse(localStorage.getItem("user")).id;
        axios.defaults.baseURL = API_BASE_URL;

        const response = await axios.get(`api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const userData = response.data;
        setUser(userData);

        if (userData.jobs && userData.jobs.length > 0) {
          setCurrentJobTitle(userData.jobs[0].jobTitle);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  if (falseRedirect) {
    return <Redirect to="/" />;
  }

  if (editRedirect) {
    return (
      <Redirect
        to={{
          pathname: "/salary-details",
          state: { selectedUser: user },
        }}
      />
    );
  }

  if (!user) {
    return null;
  }

  const {
    fullName,
    department,
    role,
    user_financial_info: financialInfo = {},
  } = user;

  const totalAllowance =
    (financialInfo.allowanceHouseRent || 0) +
    (financialInfo.allowanceMedical || 0) +
    (financialInfo.allowanceSpecial || 0) +
    (financialInfo.allowanceFuel || 0) +
    (financialInfo.allowancePhoneBill || 0) +
    (financialInfo.allowanceOther || 0);

  const totalDeduction =
    (financialInfo.deductionTax || 0) +
    (financialInfo.pf || 0) +
    (financialInfo.pt || 0) +
    (financialInfo.tds || 0) +
    (financialInfo.deductionOther || 0);

  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        {/* <DashboardTitle>Employee Salary Detail</DashboardTitle> */}
        <CardContainer>
          <CardHeader>
            <CardTitle>Samcint Solutions Private Limited</CardTitle>
          </CardHeader>
          <CardBody>
            <ProfileContainer>
              <ProfileImage>
                <img
                  src={`${process.env.PUBLIC_URL}/user-128.png`}
                  alt="User"
                  style={{ borderRadius: "50%", width: "100%", height: "100%" }}
                />
              </ProfileImage>
              <ProfileDetails>
                <h2>{fullName}</h2>
                <DataItemContainer>
                  <DataItemLabel>Employee ID</DataItemLabel>
                  <DataItemValue>{user.id}</DataItemValue>
                </DataItemContainer>

                <DataItemContainer>
                  <DataItemLabel>Department</DataItemLabel>
                  <DataItemValue>
                    {department?.departmentName || (
                      <Redirect to="/employee-list" />
                    )}
                  </DataItemValue>
                </DataItemContainer>

                <DataItemContainer>
                  <DataItemLabel>Job Title</DataItemLabel>
                  <DataItemValue>{currentJobTitle}</DataItemValue>
                </DataItemContainer>

                <DataItemContainer>
                  <DataItemLabel>Role</DataItemLabel>
                  <DataItemValue>
                    {role === "ROLE_ADMIN"
                      ? "Admin"
                      : role === "ROLE_MANAGER"
                      ? "Manager"
                      : "Employee"}
                  </DataItemValue>
                </DataItemContainer>
              </ProfileDetails>
            </ProfileContainer>
          </CardBody>
        </CardContainer>
        <FlexContainer>
          <FlexItem>
            <CardContainer>
              <CardHeader>
                <CardTitle>Salary Details</CardTitle>
              </CardHeader>
              <CardBody>
                <DataItemContainer>
                  <DataItemLabel>Employment Type:</DataItemLabel>
                  <DataItemValue>
                    {financialInfo.employmentType ||
                      user.jobs[0].employmentType}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Basic Salary:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.salaryBasic || 0}
                  </DataItemValue>
                </DataItemContainer>
              </CardBody>
            </CardContainer>
          </FlexItem>

          <FlexItem>
            <CardContainer>
              <CardHeader>
                <CardTitle>Total Salary Details</CardTitle>
              </CardHeader>
              <CardBody>
                <DataItemContainer>
                  <DataItemLabel>Gross Salary:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.salaryGross || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Total Deduction:</DataItemLabel>
                  <DataItemValue>₹ {totalDeduction}</DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Net Salary:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.salaryNet || 0}
                  </DataItemValue>
                </DataItemContainer>
              </CardBody>
            </CardContainer>
          </FlexItem>
        </FlexContainer>
        <br />
        <FlexContainer>
          <FlexItem>
            <CardContainer>
              <CardHeader>
                <CardTitle>Allowances</CardTitle>
              </CardHeader>
              <CardBody>
                <DataItemContainer>
                  <DataItemLabel>House Rent Allowance:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.allowanceHouseRent || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Medical Allowance:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.allowanceMedical || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Special Allowance:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.allowanceSpecial || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Fuel Allowance:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.allowanceFuel || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Phone Bill Allowance:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.allowancePhoneBill || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Other Allowance:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.allowanceOther || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Total Allowance:</DataItemLabel>
                  <DataItemValue>₹ {totalAllowance}</DataItemValue>
                </DataItemContainer>
              </CardBody>
            </CardContainer>
          </FlexItem>

          <FlexItem>
            <CardContainer>
              <CardHeader>
                <CardTitle>Deductions</CardTitle>
              </CardHeader>
              <CardBody>
                <DataItemContainer>
                  <DataItemLabel>Tax Deduction:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.deductionTax || 0}
                  </DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>PF:</DataItemLabel>
                  <DataItemValue>₹ {financialInfo.pf || 0}</DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>PT:</DataItemLabel>
                  <DataItemValue>₹ {financialInfo.pt || 0}</DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>TDS:</DataItemLabel>
                  <DataItemValue>₹ {financialInfo.tds || 0}</DataItemValue>
                </DataItemContainer>
                <DataItemContainer>
                  <DataItemLabel>Other Deduction:</DataItemLabel>
                  <DataItemValue>
                    ₹ {financialInfo.deductionOther || 0}
                  </DataItemValue>
                </DataItemContainer>
              </CardBody>
            </CardContainer>
          </FlexItem>
        </FlexContainer>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default SalaryViewEmployee;
