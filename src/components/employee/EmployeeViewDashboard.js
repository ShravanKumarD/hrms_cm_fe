import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../env";

// Salary view
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
    <div className="container-fluid pt-3">
      <Row>
        <Col sm={12}>
          <div id="tableContainer">
            <Card>
              <Card.Header
                style={{
                  backgroundColor: "#515e73",
                  color: "white",
                  fontSize: "17px",
                }}
              >
                Employee Salary Detail
              </Card.Header>

              <Card.Body>
                <Card.Header style={{ textAlign: "center", fontSize: "22px" }}>
                  <strong>Samcint Solutions Private Limited</strong>
                </Card.Header>
                <br />
                <Card.Title>
                  <strong>{fullName}</strong>
                </Card.Title>
                <div>
                  <Col lg={12}>
                    <Row className="pt-4">
                      <Col lg={0}>
                        <img
                          className="img-circle elevation-1 bp-2"
                          src={`${process.env.PUBLIC_URL}/user-128.png`}
                          alt="User"
                        />
                      </Col>
                      <Col className="pt-4" lg={7}>
                        <div className="emp-view-list">
                          <ul>
                            <li>
                              <span>Employee ID: </span> {user.id}
                            </li>
                            <li>
                              <span>Department: </span>
                              {department?.departmentName || (
                                <Redirect to="/employee-list" />
                              )}
                            </li>
                            <li>
                              <span>Job Title: </span> {currentJobTitle}
                            </li>
                            <li>
                              <span>Role: </span>
                              {role === "ROLE_ADMIN"
                                ? "Admin"
                                : role === "ROLE_MANAGER"
                                ? "Manager"
                                : "Employee"}
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                    <Row className="pt-4">
                      <Col sm={6}>
                        <Card className="secondary-card sal-view">
                          <Card.Header>Salary Details</Card.Header>
                          <Card.Body>
                            <Card.Text id="sal-view-details">
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Employment Type:
                                </Form.Label>
                                <span>
                                  {financialInfo.employmentType ||
                                    user.jobs[0].employmentType}
                                </span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Basic Salary:
                                </Form.Label>
                                <span>₹ {financialInfo.salaryBasic || 0}</span>
                              </Form.Group>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col sm={6}>
                        <Card className="secondary-card sal-view">
                          <Card.Header>Allowances</Card.Header>
                          <Card.Body>
                            <Card.Text id="sal-view-allowances">
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  House Rent Allowance:
                                </Form.Label>
                                <span>
                                  ₹ {financialInfo.allowanceHouseRent || 0}
                                </span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Medical Allowance:
                                </Form.Label>
                                <span>
                                  ₹ {financialInfo.allowanceMedical || 0}
                                </span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Special Allowance:
                                </Form.Label>
                                <span>
                                  ₹ {financialInfo.allowanceSpecial || 0}
                                </span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Fuel Allowance:
                                </Form.Label>
                                <span>
                                  ₹ {financialInfo.allowanceFuel || 0}
                                </span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Phone Bill Allowance:
                                </Form.Label>
                                <span>
                                  ₹ {financialInfo.allowancePhoneBill || 0}
                                </span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Other Allowance:
                                </Form.Label>
                                <span>
                                  ₹ {financialInfo.allowanceOther || 0}
                                </span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Total Allowance:
                                </Form.Label>
                                <span>₹ {totalAllowance}</span>
                              </Form.Group>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <Card className="secondary-card">
                          <Card.Header>Deductions</Card.Header>
                          <Card.Body>
                            <Card.Text id="sal-view-deductions">
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Tax Deduction:
                                </Form.Label>
                                <span>₹ {financialInfo.deductionTax || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">PF:</Form.Label>
                                <span>₹ {financialInfo.pf || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">PT:</Form.Label>
                                <span>₹ {financialInfo.pt || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">TDS:</Form.Label>
                                <span>₹ {financialInfo.tds || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Other Deduction:
                                </Form.Label>
                                <span>
                                  ₹ {financialInfo.deductionOther || 0}
                                </span>
                              </Form.Group>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col sm={6}>
                        <Card className="secondary-card">
                          <Card.Header>Total Salary Details</Card.Header>
                          <Card.Body>
                            <Card.Text id="sal-view-total">
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Gross Salary:
                                </Form.Label>
                                <span>₹ {financialInfo.salaryGross || 0}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Total Deduction:
                                </Form.Label>
                                <span>₹ {totalDeduction}</span>
                              </Form.Group>
                              <Form.Group as={Row}>
                                <Form.Label className="label">
                                  Net Salary:
                                </Form.Label>
                                <span>₹ {financialInfo.salaryNet || 0}</span>
                              </Form.Group>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SalaryViewEmployee;
