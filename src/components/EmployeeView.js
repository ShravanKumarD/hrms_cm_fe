import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import API_BASE_URL from "../env";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const EmployeeView = () => {
  const [user, setUser] = useState({});
  const [department, setDepartment] = useState({ departmentName: null });
  const [jobTitle, setJobTitle] = useState(null);
  const [userPersonalInfo, setUserPersonalInfo] = useState({
    dateOfBirth: null,
    gender: null,
    maritalStatus: null,
    fatherName: null,
    country: null,
    address: null,
    mobile: null,
    emailAddress: null,
  });
  const [userFinancialInfo, setUserFinancialInfo] = useState({
    bankName: null,
    accountName: null,
    accountNumber: null,
    iban: null,
  });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [salarySlip, setSalarySlip] = useState(null);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (location.state?.selectedUser) {
        try {
          axios.defaults.baseURL = API_BASE_URL;
          const userResponse = await axios.get(
            `api/users/${location.state.selectedUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const userData = userResponse.data;
          setUser(userData);
          setJobTitle(userData.jobs?.[0]?.jobTitle ?? "Admin/Manager");
          setDepartment(
            userData.department || { departmentName: "not provided" }
          );

          if (userData.user_personal_info) {
            const personalInfo = {
              ...userData.user_personal_info,
              dateOfBirth: userData.user_personal_info.dateOfBirth
                ? moment(userData.user_personal_info.dateOfBirth).format(
                    "D MMM YYYY"
                  )
                : null,
            };
            setUserPersonalInfo(personalInfo);
          }

          if (userData.user_financial_info) {
            setUserFinancialInfo(userData.user_financial_info);
          }

          const salaryResponse = await axios.get(
            `/api/salary-slip/${location.state.selectedUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setSalarySlip(salaryResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        history.push("/payroll/employee/search");
      }
    };

    fetchData();
  }, [location.state, history]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const onEdit = () => {
    history.push("/employee-edit", { selectedUser: user });
  };

  return (
    <div className="container-fluid pt-3">
      <Row>
        <Col sm={12}>
        <h3>Employee Details</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p></p>
            <Form>
              <span style={{ cursor: "pointer" }} onClick={onEdit}>
                <i className="far fa-edit"></i>
                <strong>Edit</strong>
              </span>
            </Form>
          </div>
          <Row className="pt-4">
            <Col lg={3} className="d-flex justify-content-center mb-4">
              <img
                className="img-fluid rounded-circle border border-secondary"
                src={process.env.PUBLIC_URL + "/user-128.png"}
                alt="User"
              />
            </Col>
            <Col lg={9}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h2 className="text-primary mb-3">{user.fullName}</h2>
                  <Row className="mb-2">
                    <Col lg={5}>
                      <span className="font-weight-bold">Employee ID:</span>
                    </Col>
                    <Col lg={7}>
                      {user.username}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={5}>
                      <span className="font-weight-bold">Department:</span>
                    </Col>
                    <Col lg={7}>
                      {department.departmentName}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={5}>
                      <span className="font-weight-bold">Job Title:</span>
                    </Col>
                    <Col lg={7}>
                      {jobTitle}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={5}>
                      <span className="font-weight-bold">Role:</span>
                    </Col>
                    <Col lg={7}>
                      {user.role === "ROLE_ADMIN"
                        ? "Admin"
                        : user.role === "ROLE_MANAGER"
                        ? "Manager"
                        : "Employee"}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm={12} lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="globalHeader">
                  <h5 className="mb-0">Personal Details</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Date of Birth:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.dateOfBirth || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Gender:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.gender || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Marital Status:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.maritalStatus || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Father's Name:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.fatherName || "Not available"}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="globalHeader">
                  <h5 className="mb-0">Contact Details</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Location:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.country || "Not available"}, {" "}
                      {userPersonalInfo.city || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Address:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.address || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Mobile:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.mobile || "Not available"}
                      {userPersonalInfo.phone
                        ? ` (${userPersonalInfo.phone})`
                        : ""}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Email:</strong>
                    </Col>
                    <Col xs={7}>
                      {userPersonalInfo.emailAddress || "Not available"}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} lg={12}>
              <Card className="shadow-sm">
                <Card.Header className="globalHeader">
                  <h5 className="mb-0">Bank Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Bank Name:</strong>
                    </Col>
                    <Col xs={7}>
                      {userFinancialInfo.bankName || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Account Name:</strong>
                    </Col>
                    <Col xs={7}>
                      {userFinancialInfo.accountName || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>Account Number:</strong>
                    </Col>
                    <Col xs={7}>
                      {userFinancialInfo.accountNumber || "Not available"}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={5}>
                      <strong>IFSC:</strong>
                    </Col>
                    <Col xs={7}>
                      {userFinancialInfo.iban || "Not available"}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeView;
