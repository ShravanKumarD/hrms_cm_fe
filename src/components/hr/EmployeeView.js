import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../../env";
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
  theme,
} from "./EmployeeStyledComponents";
import { ThemeProvider } from "styled-components";

const Card = ({ title, children, extraContent }) => (
  <CardContainer>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {extraContent}
    </CardHeader>
    <CardBody>{children}</CardBody>
  </CardContainer>
);

const DataItem = ({ label, value }) => (
  <DataItemContainer>
    <DataItemLabel>{label}</DataItemLabel>
    <DataItemValue>{value || "N/A"}</DataItemValue>
  </DataItemContainer>
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
        console.log(data.jobs[0].jobTitle, "emp data");
        const currentJob = data.jobs?.find((job) => job != null);

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
    <ThemeProvider theme={theme}>
      {/* <DashboardContainer> */}
        <h3>Employee Details</h3>
        {/* <FlexContainer>
          <FlexItem fullWidth>
            <Card title="Profile">
              <ProfileContainer>
                <ProfileImage>{user.fullName?.charAt(0) || "U"}</ProfileImage>
                <ProfileDetails>
                  <h2>{user.fullName}</h2>
                  <p>{job.jobTitle}</p>
                  <p>{department.departmentName}</p>
                </ProfileDetails>
              </ProfileContainer>
            </Card>
          </FlexItem>

          <FlexItem>
            <Card title="Work Information">
              <DataItem label="Employee ID" value={user.username} />
              <DataItem label="Department" value={department.departmentName} />
              <DataItem label="Job Title" value={job.jobTitle||"n/a"} />
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
          </FlexItem>

          <FlexItem>
            <Card title="Personal Details">
              <DataItem
                label="Date of Birth"
                value={userPersonalInfo.dateOfBirth}
              />
              <DataItem label="Gender" value={userPersonalInfo.gender} />
              <DataItem
                label="Marital Status"
                value={userPersonalInfo.maritalStatus}
              />
              <DataItem
                label="Father's Name"
                value={userPersonalInfo.fatherName}
              />
            </Card>
          </FlexItem>

          <FlexItem>
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
              <DataItem
                label="Email Address"
                value={userPersonalInfo.emailAddress}
              />
            </Card>
          </FlexItem>

          <FlexItem>
            <Card title="Bank Information">
              <DataItem label="Bank Name" value={userFinancialInfo.bankName} />
              <DataItem
                label="Account Name"
                value={userFinancialInfo.accountName}
              />
              <DataItem
                label="Account Number"
                value={userFinancialInfo.accountNumber}
              />
              <DataItem label="IBAN" value={userFinancialInfo.iban} />
            </Card>
          </FlexItem>
        </FlexContainer> */}
        <div className="card col-sm-10">
          <table>
            <thead>
              <tr>
                <th colSpan="2">Profile</th>
              </tr>
            </thead>

            <tbody>
              {/* <tr>
      <td>Initial</td>
      <td>{user.fullName?.charAt(0) || "U"}</td>
    </tr> */}
              <tr>
                <td>Full Name</td>
                <td className="text-primary mb-3"><strong>{user.fullName}</strong></td>
              </tr>
              <tr>
                <td>Job Title</td>
                <td>{job.jobTitle}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td>{department.departmentName}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
        <div className="card col-5">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">Personal Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Date of Birth</td>
                  <td>{userPersonalInfo.dateOfBirth}</td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td>{userPersonalInfo.gender}</td>
                </tr>
                <tr>
                  <td>Marital Status</td>
                  <td>{userPersonalInfo.maritalStatus}</td>
                </tr>
                <tr>
                  <td>Father's Name</td>
                  <td>{userPersonalInfo.fatherName}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card col-5">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">Work Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Employee ID</td>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <td>Department</td>
                  <td>{department.departmentName}</td>
                </tr>
                <tr>
                  <td>Job Title</td>
                  <td>{job.jobTitle || "n/a"}</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>
                    {user.role === "ROLE_ADMIN"
                      ? "Admin"
                      : user.role === "ROLE_MANAGER"
                      ? "Manager"
                      : "Employee"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
    
        </div>
        <div className="row">
          <div className="card col-5">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">Contact Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Location</td>
                  <td>{`${userPersonalInfo.country}, ${userPersonalInfo.city}`}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{userPersonalInfo.address}</td>
                </tr>
                <tr>
                  <td>Mobile</td>
                  <td>{`${userPersonalInfo.mobile} ${
                    userPersonalInfo.phone ? `(${userPersonalInfo.phone})` : ""
                  }`}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{userPersonalInfo.emailAddress}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card  col-5">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">Bank Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bank Name</td>
                  <td>{userFinancialInfo.bankName}</td>
                </tr>
                <tr>
                  <td>Account Name</td>
                  <td>{userFinancialInfo.accountName}</td>
                </tr>
                <tr>
                  <td>Account Number</td>
                  <td>{userFinancialInfo.accountNumber}</td>
                </tr>
                <tr>
                  <td>IFSC</td>
                  <td>{userFinancialInfo.iban}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      {/* </DashboardContainer> */}
    </ThemeProvider>
  );
};

export default EmployeeDashboard;
