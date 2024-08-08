import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import SalarySlipTemplate from "./SalarySlipTemplate";
import OfferLetterTemplate from "./OfferLetterTemplate";
import HikeLetterTemplate from "./HikeLetterTemplate";
import RelievingLetterTemplate from "./RelieveingLetterTemplate";
import API_BASE_URL from "../env";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  const navigate = useHistory();
  const history = useHistory();
  const location = useLocation();
  const slipRef = useRef(null);

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
        // navigate("/payroll/employee/search");
        history.push("/payroll/employee/search")
      }
    };

    fetchData();
  }, [location.state, navigate]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const onEdit = () => {
    // navigate("/payroll/employee/edit", { state: { selectedUser: user } });
    history.push("/employee-edit", { selectedUser: user } );
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <div className="container-fluid pt-3">
            <Row>
              <Col sm={12}>
                <Card>
                  <Card.Header
                    style={{
                      backgroundColor: "#515e73",
                      color: "white",
                      fontSize: "17px",
                    }}
                  >
                    Employee Details{" "}
                    <Form className="float-right">
                      <span style={{ cursor: "pointer" }} onClick={onEdit}>
                        <i className="far fa-edit"></i> Edit
                      </span>
                    </Form>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>
                      <strong>{user.fullName}</strong>
                    </Card.Title>
                    <div>
                      <Col lg={12}>
                        <Row className="pt-4">
                          <Col lg={3}>
                            <img
                              className="img-circle elevation-1 bp-2"
                              src={process.env.PUBLIC_URL + "/user-128.png"}
                              alt="User"
                            />
                          </Col>
                          <Col className="pt-4" lg={9}>
                            <div className="emp-view-list">
                              <ul>
                                <li>
                                  <span>Employee ID: </span> {user.id}
                                </li>
                                <li>
                                  <span>Department: </span>{" "}
                                  {department.departmentName}
                                </li>
                                <li>
                                  <span>Job Title: </span> {jobTitle}
                                </li>
                                <li>
                                  <span>Role: </span>
                                  {user.role === "ROLE_ADMIN"
                                    ? "Admin"
                                    : user.role === "ROLE_MANAGER"
                                    ? "Manager"
                                    : "Employee"}
                                </li>
                              </ul>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={6}>
                            <Card className="secondary-card emp-view">
                              <Card.Header>Personal Details</Card.Header>
                              <Card.Body>
                                <Card.Text id="emp-view-personal">
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Date of Birth:
                                    </Form.Label>
                                    <span>{userPersonalInfo.dateOfBirth}</span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Gender:
                                    </Form.Label>
                                    <span>{userPersonalInfo.gender}</span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Marital Status:
                                    </Form.Label>
                                    <span>
                                      {userPersonalInfo.maritalStatus}
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Father's Name:
                                    </Form.Label>
                                    <span>{userPersonalInfo.fatherName}</span>
                                  </Form.Group>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col sm={6}>
                            <Card className="secondary-card emp-view">
                              <Card.Header>Contact Details</Card.Header>
                              <Card.Body>
                                <Card.Text id="emp-view-contact">
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Location:
                                    </Form.Label>
                                    <span>
                                      {userPersonalInfo.country},{" "}
                                      {userPersonalInfo.city}
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Address:
                                    </Form.Label>
                                    <span>{userPersonalInfo.address}</span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Mobile:
                                    </Form.Label>
                                    <span>
                                      {userPersonalInfo.mobile}{" "}
                                      {userPersonalInfo.phone
                                        ? ` (${userPersonalInfo.phone})`
                                        : null}
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Email Address:
                                    </Form.Label>
                                    <span>{userPersonalInfo.emailAddress}</span>
                                  </Form.Group>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={6}>
                            <Card className="secondary-card">
                              <Card.Header>Bank Information</Card.Header>
                              <Card.Body>
                                <Card.Text id="emp-view-bank">
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Bank Name:
                                    </Form.Label>
                                    <span>{userFinancialInfo.bankName}</span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Account Name:
                                    </Form.Label>
                                    <span>{userFinancialInfo.accountName}</span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      Account Number:
                                    </Form.Label>
                                    <span>
                                      {userFinancialInfo.accountNumber}
                                    </span>
                                  </Form.Group>
                                  <Form.Group as={Row}>
                                    <Form.Label className="label">
                                      IBAN:
                                    </Form.Label>
                                    <span>{userFinancialInfo.iban}</span>
                                  </Form.Group>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col sm={12}>
                            <Card className="secondary-card mb-2">
                              <Card.Header className="p-2">
                                Salary Slip
                              </Card.Header>
                              <Card.Body className="p-2">
                                <Row>
                                  <Col>
                                    <Form.Group controlId="monthSelect">
                                      <Form.Label>Select Month</Form.Label>
                                      <Form.Control
                                        as="select"
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                      >
                                        <option value="">Select a month</option>
                                        {months.map((month, index) => (
                                          <option key={index} value={month}>
                                            {month}
                                          </option>
                                        ))}
                                      </Form.Control>
                                    </Form.Group>
                                    <SalarySlipTemplate
                                      user={user}
                                      salarySlip={salarySlip}
                                      selectedMonth={selectedMonth}
                                    />
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col sm={12}>
                            <Card className="secondary-card mb-2">
                              <Card.Header className="p-2">
                                Offer Letter
                              </Card.Header>
                              <Card.Body className="p-2">
                                <Row>
                                  <Col>
                                    <OfferLetterTemplate />
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col sm={12}>
                            <Card className="secondary-card mb-2">
                              <Card.Header className="p-2">
                                Hike Letter
                              </Card.Header>
                              <Card.Body className="p-2">
                                <Row>
                                  <Col>
                                    <HikeLetterTemplate
                                      effective_date="2024-09-01"
                                      new_salary="$75,000"
                                      previous_salary="$65,000"
                                      hr_name="John Doe"
                                    />
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col sm={12}>
                            <Card className="secondary-card mb-2">
                              <Card.Header className="p-2">
                                Relieving Letter
                              </Card.Header>
                              <Card.Body className="p-2">
                                <Row>
                                  <Col>
                                    <RelievingLetterTemplate />
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Col>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmployeeView;
