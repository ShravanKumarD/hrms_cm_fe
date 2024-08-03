import React, { Component, createRef } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import SalarySlipTemplate from "./SalarySlipTemplate";
import OfferLetterTemplate from "./OfferLetterTemplate";
import HikeLetterTemplate from "./HikeLetterTemplate";
import RelievingLetterTemplate from "./RelieveingLetterTemplate";
import ResignationTemplate from "./ResignationTemplate";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
export default class EmployeeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      department: {
        departmentName: null,
      },
      // job: {
      //   jobTitle: null,
      // },
      jobTitle: null,
      userPersonalInfo: {
        dateOfBirth: null,
        gender: null,
        maritalStatus: null,
        fatherName: null,
        country: null,
        address: null,
        mobile: null,
        emailAddress: null,
      },
      userFinancialInfo: {
        bankName: null,
        accountName: null,
        accountNumber: null,
        iban: null,
      },
      selectedMonth: '' ,
      falseRedirect: false,
      editRedirect: false,
    };
    this.slipRef = createRef();
  }
  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  }
  componentDidMount() {
    if (this.props.location.state) {
      axios.defaults.baseURL = "http://13.232.177.171";
      axios({
        method: "get",
        url: "api/users/" + this.props.location.state.selectedUser.id,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          let user = res.data;
          console.log(user,"uesrrrrrrrr")
          this.setState({ user: user }, () => {
            this.setState({
              jobTitle: user.jobs?.[0]?.jobTitle ?? "Admin/Manger"
            });
            
            if (user.jobs) {
              let jobs = user.jobs;
              jobs.map((job) => {
                if (
                  new Date(job.startDate) <= Date.now() &&
                  new Date(job.endDate) >= Date.now()
                ) {
                  this.setState({ job: job });
                }
              });
            }
            if (user.department) {
              this.setState({
                department: user.department ? user.department : "not provided"
              });
              
            }
            if (user.user_personal_info) {
              if (user.user_personal_info.dateOfBirth) {
                user.user_personal_info.dateOfBirth = moment(
                  user.user_personal_info.dateOfBirth
                ).format("D MMM YYYY");
              }
              this.setState({ userPersonalInfo: user.user_personal_info });
            }
            if (user.user_financial_info) {
              this.setState({ userFinancialInfo: user.user_financial_info });
            }
          });
        })
        .catch((err) => {
          console.log(err); 
        });
        axios({
          method: "get",
          url: "/api/salary-slip/" + this.props.location.state.selectedUser.id,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => {
          let salary_slip = res.data;
          this.setState({salary_slip:salary_slip});
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      this.setState({ falseRedirect: true });
    }
  }

  // onEdit = () => {
  //   this.setState({ editRedirect: true });
  // };

  // downloadPDF = () => {
  //   const salarySlipContent = this.slipRef.current.innerHTML;
  //   const pdfContent = htmlToPdfmake(salarySlipContent);
  //   const documentDefinition = { content: pdfContent };
  //   pdfMake.createPdf(documentDefinition).download("salary_slip.pdf");
  // };

  render() {
    if (this.state.falseRedirect) {
      return <Redirect to="/payroll/employee/search" />;
    }
    if (this.state.editRedirect) {
      return (
        <Redirect
          to={{
            pathname: "/payroll/employee/edit",
            state: { selectedUser: this.state.user },
          }}
        />
      );
    }

    return (
      <div>
        <Card>
          <Card.Body>
            <div className="container-fluid pt-3">
              {this.state.falseRedirect ? <Redirect to="/" /> : <></>}
              {this.state.editRedirect ? (
                <Redirect
                  to={{
                    pathname: "/employee-edit",
                    state: { selectedUser: this.state.user },
                  }}
                />
              ) : null}
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
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={this.onEdit}
                        >
                          <i className="far fa-edit"></i> Edit
                        </span>
                      </Form>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>
                        <strong>{this.state.user.fullName}</strong>
                      </Card.Title>
                      <div>
                        <Col lg={12}>
                          <Row className="pt-4">
                            <Col lg={3}>
                              <img
                                className="img-circle elevation-1 bp-2"
                                src={process.env.PUBLIC_URL + "/user-128.png"}
                              ></img>
                            </Col>
                            <Col className="pt-4" lg={9}>
                              <div className="emp-view-list">
                                <ul>
                                  <li>
                                    <span>Employee ID: </span>{" "}
                                    {this.state.user.id}
                                  </li>
                                  <li>
                                    <span>Department: </span>{" "}
                                    {this.state.department.departmentName}
                                  </li>
                                  <li>
                                    <span>Job Title: </span>{" "}
                                    {this.state.jobTitle}
                                  </li>
                                  <li>
                                    <span>Role: </span>
                                    {this.state.user.role === "ROLE_ADMIN"
                                      ? "Admin"
                                      : this.state.user.role === "ROLE_MANAGER"
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
                                      <span>
                                        {
                                          this.state.userPersonalInfo
                                            .dateOfBirth
                                        }
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Gender:
                                      </Form.Label>
                                      <span>
                                        {this.state.userPersonalInfo.gender}
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Marital Status:
                                      </Form.Label>
                                      <span>
                                        {
                                          this.state.userPersonalInfo
                                            .maritalStatus
                                        }
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Father's Name:
                                      </Form.Label>
                                      <span>
                                        {this.state.userPersonalInfo.fatherName}
                                      </span>
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
                                        {this.state.userPersonalInfo.country},{" "}
                                        {this.state.userPersonalInfo.city}
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Address:
                                      </Form.Label>
                                      <span>
                                        {this.state.userPersonalInfo.address}
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Mobile:
                                      </Form.Label>
                                      <span>
                                        {this.state.userPersonalInfo.mobile}{" "}
                                        {this.state.userPersonalInfo.phone
                                          ? " (" +
                                            this.state.userPersonalInfo.phone +
                                            ")"
                                          : null}
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Email Address:
                                      </Form.Label>
                                      <span>
                                        {
                                          this.state.userPersonalInfo
                                            .emailAddress
                                        }
                                      </span>
                                    </Form.Group>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                          <Row>
                            <Col cm={6}>
                              <Card className="secondary-card">
                                <Card.Header>Bank Information</Card.Header>
                                <Card.Body>
                                  <Card.Text id="emp-view-bank">
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Bank Name:
                                      </Form.Label>
                                      <span>
                                        {this.state.userFinancialInfo.bankName}
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Account Name:
                                      </Form.Label>
                                      <span>
                                        {
                                          this.state.userFinancialInfo
                                            .accountName
                                        }
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        Mobile:
                                      </Form.Label>
                                      <span>
                                        {
                                          this.state.userFinancialInfo
                                            .accountNumber
                                        }
                                      </span>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                      <Form.Label className="label">
                                        IBAN:
                                      </Form.Label>
                                      <span>
                                        {this.state.userFinancialInfo.iban}
                                      </span>
                                    </Form.Group>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col sm={12}>
                            <Card className="secondary-card">
                            <Card.Header>Salary Slip</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group controlId="monthSelect">
                <Form.Label>Select Month</Form.Label>
                <Form.Control 
                  as="select" 
                  value={this.state.selectedMonth} 
                  onChange={this.handleMonthChange}
                >
                  <option value="">Select a month</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <SalarySlipTemplate
                user={this.state.user}
                salarySlip={this.state.salary_slip}
                selectedMonth={this.state.selectedMonth}
              />
            </Col>
          </Row>
        </Card.Body>
                              </Card>
                            </Col>
                            <Col sm={12}>
                            <Card className="secondary-card">
                              <Card.Header>Offer Letter</Card.Header>
                              <Card.Body>
                                <Row>
                                  <Col>
                                  <OfferLetterTemplate/>
                                  </Col>
                                </Row>
                              </Card.Body>
                              </Card>
                            </Col>
                            <Col sm={12}>
                            <Card className="secondary-card">
                              <Card.Header>Hike Letter</Card.Header>
                              <Card.Body>
                                <Row>
                                  <Col>
                                  <HikeLetterTemplate/>
                                  </Col>
                                </Row>
                              </Card.Body>
                              </Card>
                            </Col>
                            <Col sm={12}>
                            <Card className="secondary-card">
                              <Card.Header>Relieving Letter</Card.Header>
                              <Card.Body>
                                <Row>
                                  <Col>
                                  <RelievingLetterTemplate/>
                                  </Col>
                                </Row>
                              </Card.Body>
                              </Card>
                            </Col>
                            {/* <Col sm={12}>
                            <Card className="secondary-card">
                              <Card.Header>Resignation Letter</Card.Header>
                              <Card.Body>
                                <Row>
                                  <Col>
                                  <ResignationTemplate/>
                                  </Col>
                                </Row>
                              </Card.Body>
                              </Card>
                            </Col> */}
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
  }
}
