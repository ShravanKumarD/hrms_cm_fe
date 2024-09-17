import React, { Component } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import API_BASE_URL from "../env";

export default class SalaryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      currentJobTitle: null,
      falseRedirect: false,
      editRedirect: false,
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      axios.defaults.baseURL = API_BASE_URL;
      axios({
        method: "get",
        url: "api/users/" + this.props.location.state.selectedUser.id,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          this.setState({ user: res.data }, () => {
            if (this.state.user.jobs) {
              this.setState({ currentJobTitle: this.state.user.jobs[0].jobTitle });
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.setState({ falseRedirect: true });
    }
  }

  exportToPDF = () => {
    const input = document.getElementById("tableContainer");
    setTimeout(() => {
      html2canvas(input, {
        scrollY: -window.scrollY,
        scale: 2,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: [canvas.width, canvas.height],
          });
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save("employee_salaries.pdf");
        })
        .catch((error) => {
          console.error("Error generating PDF", error);
        });
    }, 500);
  };

  render() {
    return (
      <div className="p-4">
        <div className="container">
          {this.state.falseRedirect ? <Redirect to="/" /> : null}
          {this.state.editRedirect ? (
            <Redirect
              to={{
                pathname: "/salary-details",
                state: { selectedUser: this.state.user },
              }}
            />
          ) : null}
          {this.state.user ? (
            <div className="text-center">
            
              <div className="header mb-4">
                <h2>Employee Salary Detail</h2>
                <Button className="dashboard-icons" onClick={this.exportToPDF}>
                  Export to PDF
                </Button>
              </div>
              <h3>Samcint Solutions Private Limited</h3>
              <Card>
              <div className="employee-details mb-4">
             
                
                <Row className=" ">
                  <Col lg={4} className="text-center">
                    <img
                      className="img-circle elevation-1"
                      src={process.env.PUBLIC_URL + "/user-128.png"}
                      alt="User"
                    />
                  </Col>
                  <Col lg={8} className="text-left">
                    <ul className="list-unstyled">
                      <li><h4 className="text-primary ">{this.state.user.fullName}</h4></li>
                      <li><strong>Employee ID:</strong> {this.state.user.id}</li>
                      <li><strong>Department:</strong> {this.state.user.department?.departmentName || 'N/A'}</li>
                      <li><strong>Job Title:</strong> {this.state.currentJobTitle}</li>
                      <li><strong>Role:</strong> {this.state.user.role === "ROLE_ADMIN" ? "Admin" : this.state.user.role === "ROLE_MANAGER" ? "Manager" : "Employee"}</li>
                    </ul>
                  </Col>
                </Row>
              </div>
              </Card>
              <Row className="justify-content-center">
                <Col sm={6} className="mb-4">
                  <div className="salary-details p-3 border rounded">
                    <h5>Salary Details</h5>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Employment Type:</Form.Label>
                      <Col sm={6}>
                        <p>{this.state.user.user_financial_info?.employmentType || this.state.user.jobs[0]?.employmentType}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Basic Salary:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.salaryBasic || 0}</p>
                      </Col>
                    </Form.Group>
                  </div>
                </Col>
                <Col sm={6} className="mb-4">
                  <div className="allowances p-3 border rounded">
                    <h5>Allowances</h5>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">House Rent Allowance:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.allowanceHouseRent || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Medical Allowance:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.allowanceMedical || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Special Allowance:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.allowanceSpecial || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Fuel Allowance:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.allowanceFuel || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Phone Bill Allowance:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.allowancePhoneBill || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Other Allowance:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.allowanceOther || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Total Allowance:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {(
                          this.state.user.user_financial_info?.allowanceHouseRent +
                          this.state.user.user_financial_info?.allowanceMedical +
                          this.state.user.user_financial_info?.allowanceSpecial +
                          this.state.user.user_financial_info?.allowanceFuel +
                          this.state.user.user_financial_info?.allowancePhoneBill +
                          this.state.user.user_financial_info?.allowanceOther
                        ) || 0}</p>
                      </Col>
                    </Form.Group>
                  </div>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col sm={6} className="mb-4">
                  <div className="deductions p-3 border rounded">
                    <h5>Deductions</h5>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Tax Deduction:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.deductionTax || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">PF:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.pf || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">PT:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.pt || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">TDS:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.tds || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Other Deduction:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.deductionOther || 0}</p>
                      </Col>
                    </Form.Group>
                  </div>
                </Col>
                <Col sm={6} className="mb-4">
                  <div className="total-salary-details p-3 border rounded">
                    <h5>Total Salary Details</h5>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Gross Salary:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.salaryGross || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Total Deduction:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {(
                          this.state.user.user_financial_info?.salaryGross - 
                          this.state.user.user_financial_info?.salaryNet
                        ) || 0}</p>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label className="col-sm-6">Net Salary:</Form.Label>
                      <Col sm={6}>
                        <p>₹ {this.state.user.user_financial_info?.salaryNet || 0}</p>
                      </Col>
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
