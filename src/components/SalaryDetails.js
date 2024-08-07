import React, { Component } from "react";
import { Card, Button, Form, Alert, Badge } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import JobAddModal from "./JobAddModal";
import JobEditModal from "./JobEditModal";
import JobDeleteModal from "./JobDeleteModal";
import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import AlertModal from "./AlertModal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import API_BASE_URL from "../env.js";

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

export default class SalaryDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      selectedDepartment: null,
      selectedUser: null,
      financialId: null,
      users: [],
      salaryBasic: 0,
      allowanceHouseRent: 0,
      allowanceMedical: 0,
      allowanceSpecial: 0,
      allowanceFuel: 0,
      allowancePhoneBill: 0,
      allowanceOther: 0,
      deductionTax: 0,
      deductionOther: 0,
      deductionTotal: 0,
      pf: 0,
      tds: 0,
      pt: 0,
      hasError: false,
      errMsg: "",
      completed: false,
      date_of_joining: '',
      selectedMonth:''
    };
  }

  componentDidMount() {
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: "/api/departments",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ departments: res.data }, () => {
          if (this.props.location.state) {
            this.setState(
              {
                selectedDepartment:
                  this.props.location.state.selectedUser.departmentId,
              },
              () => {
                this.fetchData();
              }
            );
            this.setState(
              { selectedUser: this.props.location.state.selectedUser.id },
              () => {
                this.pushChanges();
              }
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onView = (rowData) => () => {
    this.setState({ viewRedirect: true, selectedUser: rowData.user });
  };
  onEdit = (rowData) => () => {
    this.setState({ editRedirect: true, selectedUser: rowData.user });
  };
  exportToPDF = () => {
    const input = document.getElementById("tableContainer");
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10);
        pdf.save("employee_salaries.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF", error);
      });
  };
  pushChanges = () => {
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: "api/financialInformations/user/" + this.state.selectedUser,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState((prevState) => ({
          ...prevState,
          financialId: res.data[0].id,
          ...res.data[0],
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchData = () => {
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: "api/departments/" + this.state.selectedDepartment,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let department = res.data;
        let users = [];

        department.users.map((user) => {
          users.push(user);
        });

        this.setState({ users: users });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchDataAll = () => {
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: "api/departments/",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        let departments = res.data;
        let users = [];

        departments.map((dept) => {
          dept.users.map((user) => {
            users.push(user);
          });
        });

        this.setState({ users: users });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  pushDepartments = () => {
    let items = [];
    items.push(
      <option key={584390} value="all">
        All departments
      </option>
    );
    this.state.departments.map((dept, index) => {
      if (this.state.selectedDepartment == dept.id) {
        items.push(
          <option key={index} value={dept.id} defaultValue>
            {dept.departmentName}
          </option>
        );
      } else {
        items.push(
          <option key={index} value={dept.id}>
            {dept.departmentName}
          </option>
        );
      }
    });
    return items;
  };

  pushUsers = () => {
    let items = [];

    this.state.users.map((user, index) => {
      items.push(
        <option key={index} value={user.id}>
          {user.fullName}
        </option>
      );
    });

    return items;
  };

  handleDepartmentChange = (event) => {
    this.setState({ selectedDepartment: event.target.value }, () => {
      if (this.state.selectedDepartment === "all") {
        this.fetchDataAll();
      } else {
        this.fetchData();
      }
    });
  };
  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };
  handleUserChange = (event) => {
    this.state.users.map((user) => {
      if (user.id == event.target.value) {
        this.setState({ selectedUser: event.target.value }, () => {
          axios.defaults.baseURL = API_BASE_URL;
          axios({
            method: "get",
            url: "api/financialInformations/user/" + this.state.selectedUser,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((res) => {
              this.setState((prevState) => ({
                ...prevState,
                financialId: res.data[0].id,
                ...res.data[0],
              }));
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    });
  };

  handleChangeEmploymentType = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  // handleChange = (event) => {
  //   const { name, value } = event.target;
  //   this.setState({ [name]: value });
  //   const numericValue = value === "" ? 0 : Number(value);
  //   if (isNaN(numericValue)) {
  //     this.setState({ [name]: 0 });
  //   } else {
  //     this.setState({ [name]: numericValue });
  //   }
  // };
  handleChange = (event) => {
    const { name, value } = event.target;
    
    if (name === "date_of_joining") {
      this.setState({ [name]: value });
    } else {
      const numericValue = value === "" ? 0 : Number(value);
      if (isNaN(numericValue)) {
        this.setState({ [name]: 0 });
      } else {
        this.setState({ [name]: numericValue });
      }
    }
  };
  

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedUser) {
      axios.defaults.baseURL = API_BASE_URL;
      axios({
        method: "get",
        url: "api/users/" + this.state.financialId,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          this.setState({ name: res.data.fullName });
          this.setState({ designation: res.data.jobs[0].jobTitle });
          this.setState({ address: res.data.user_personal_info.address });
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }

  // onSubmit = (event) => {
  //   event.preventDefault();
  //   const {
  //     financialId,
  //     name,
  //     address,
  //     designation,
  //     month,
  //     date_of_joining,
  //     employmentType,
  //     salaryBasic,
  //     allowanceHouseRent,
  //     allowanceMedical,
  //     allowanceSpecial,
  //     allowanceFuel,
  //     allowancePhoneBill,
  //     allowanceOther,
  //     deductionTax,
  //     deductionOther,
  //     pf,
  //     tds,
  //     pt,
  //   } = this.state;

  //   const salaryGross =
  //     salaryBasic +
  //     allowanceHouseRent +
  //     allowanceMedical +
  //     allowanceSpecial +
  //     allowanceFuel +
  //     allowancePhoneBill +
  //     allowanceOther;

  //   const deductionTotal =
  //     deductionTax +
  //     deductionOther +
  //     pf +
  //     tds +
  //     pt;

  //   const salaryNet = salaryGross - deductionTotal;

  //   const data = {
  //     month,
  //     date_of_joining,
  //     employmentType,
  //     salaryBasic,
  //     allowanceHouseRent,
  //     allowanceMedical,
  //     allowanceSpecial,
  //     allowanceFuel,
  //     allowancePhoneBill,
  //     allowanceOther,
  //     deductionTax,
  //     deductionOther,
  //     pf,
  //     tds,
  //     pt,
  //     salaryGross,
  //     deductionTotal,
  //     salaryNet,
  //   };

  //   axios.defaults.baseURL = API_BASE_URL;
  //   // url: "api/financialInformations/" + financialId
    
  //   axios({
  //     method: "post",
  //     url: "api/salary-slip/" + financialId,
  //     data,
  //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //   })
  //     .then((res) => {
  //       this.setState({ completed: true });
  //       window.scrollTo(0, 0);
  //     })
  //     .catch((err) => {
  //       this.setState({ hasError: true, errMsg: err.response.data.message });
  //       window.scrollTo(0, 0);
  //     });
  // };
  onSubmit = (event) => {
    event.preventDefault();
    const {
      financialId,
      name,
      address,
      designation,
      selectedMonth,
      date_of_joining,
      employmentType,
      salaryBasic,
      allowanceHouseRent,
      allowanceMedical,
      allowanceSpecial,
      allowanceFuel,
      allowancePhoneBill,
      allowanceOther,
      deductionTax,
      deductionOther,
      pf,
      tds,
      pt,
    } = this.state;
  
    const salaryGross =
      salaryBasic +
      allowanceHouseRent +
      allowanceMedical +
      allowanceSpecial +
      allowanceFuel +
      allowancePhoneBill +
      allowanceOther;
  
    const deductionTotal =
      deductionTax +
      deductionOther +
      pf +
      tds +
      pt;
  
    const salaryNet = salaryGross - deductionTotal;
  
    const data = {
      month:selectedMonth,
      date_of_joining,
      employmentType,
      salaryBasic,
      allowanceHouseRent,
      allowanceMedical,
      allowanceSpecial,
      allowanceFuel,
      allowancePhoneBill,
      allowanceOther,
      deductionTax,
      deductionOther,
      pf,
      tds,
      pt,
      salaryGross,
      deductionTotal,
      salaryNet,
    };
  
    console.log("Submitting data:", data); // Log the data being submitted
  
    axios.defaults.baseURL = API_BASE_URL;
  
    axios({
      method: "post",
      url: `api/salary-slip/${financialId}`,
      data,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        console.log("Response from salary slip API:", res);
        
        // Make the second request only if the first one is successful
        return axios({
          method: "post",
          url: `api/financialInformations/${financialId}`,
          data,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      })
      .then((res) => {
        console.log("Response from financial informations API:", res);
        this.setState({ completed: true });
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error("Error in submission:", err);
        console.error("Error details:", err.response?.data?.message);
        this.setState({ hasError: true, errMsg: err.response?.data?.message });
        window.scrollTo(0, 0);
      });
  };
  

  onEdit(job) {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedJob: job, showEditModel: true });
    };
  }
  validateForm = () => {
    const {
      name,
      address,
      designation,
      salaryBasic,
      allowanceHouseRent,
      allowanceFuel,
      allowanceSpecial,
      allowanceMedical,
      salaryGross,
      pt,
      pf,
      deductionOther,
      totalDeductions,
    } = this.state;
    if (
      !name ||
      !address ||
      !designation ||
      !salaryBasic ||
      !allowanceHouseRent ||
      !allowanceFuel ||
      !allowanceSpecial ||
      !allowanceMedical ||
      !salaryGross ||
      !pt ||
      !pf ||
      !deductionOther ||
      !totalDeductions
    ) {
      alert("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  render() {
    const formattedDate = moment(this.state.date_of_joining).format(
      "YYYY-MM-DD"
    );
    let salaryGross =
      this.state.salaryBasic +
      this.state.allowanceHouseRent +
      this.state.allowanceMedical +
      this.state.allowanceSpecial +
      this.state.allowancePhoneBill +
      this.state.allowanceFuel +
      this.state.allowanceOther;

    let deductionTotal =
      this.state.deductionTax +
      this.state.deductionOther +
      this.state.pf +
      this.state.tds +
      this.state.pt;

    let salaryNet = salaryGross - deductionTotal;

    return (
      <div className="container-fluid pt-2">
        <div className="row">
          {this.state.hasError ? (
            <Alert variant="danger" className="m-3" block>
              {this.state.errMsg}
            </Alert>
          ) : this.state.completed ? (
            <Alert variant="success" className="m-3" block>
              Financial Infromation have been updated.
            </Alert>
          ) : (
            <></>
          )}

          <div className="col-sm-12">
            <Card className="main-card">
              <Card.Header>
                <div className="required">Manage Salary Details</div>
              </Card.Header>
              <Card.Body>
                <div>
                  <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                      <Form.Label>Select Department: </Form.Label>
                      <Form.Control
                        as="select"
                        className="select-css"
                        value={this.state.selectedDepartment}
                        onChange={this.handleDepartmentChange}
                      >
                        <option key={34432432} value="">
                          Choose one...
                        </option>
                        {this.pushDepartments()}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Select User: </Form.Label>
                      <Form.Control
                        as="select"
                        className="select-css"
                        value={this.state.selectedUser || ""}
                        onChange={this.handleUserChange}
                      >
                        <option value="">Choose one...</option>
                        {this.pushUsers()}
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
        {this.state.selectedUser ? (
          <Form onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-sm-6">
                <Card className="main-card">
                  <Card.Header>Salary Details</Card.Header>
                  <Card.Body>
                    <div>
                      <Form.Group>
                        <Form.Label className="required">
                          Employment Type{" "}
                        </Form.Label>
                        <Form.Control
                          as="select"
                          className="select-css"
                          value={this.state.employmentType}
                          onChange={this.handleChangeEmploymentType}
                          name="employmentType"
                        >
                          <option value="">Choose one...</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label className="required">
                          Basic Salary
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.salaryBasic}
                          onChange={this.handleChange}
                          name="salaryBasic"
                        />
                      </Form.Group>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-sm-6">
                <Card className="main-card">
                  <Card.Header>Employment Details</Card.Header>
                  <Card.Body>
                    <div>
                    <Form.Group controlId="monthSelect">
          <Form.Label>Select Month</Form.Label>
          <Form.Control
            as="select"
            value={this.state.selectedMonth}
            onChange={this.handleMonthChange}
          >
            <option value="">Select a month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
                  
   <Form.Group>
                      <Form.Label className="required">Date of Joining</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_of_joining"
                        value={formattedDate}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <Card className="main-card">
                  <Card.Header>Allowances</Card.Header>
                  <Card.Body>
                    <div>
                      <Form.Group>
                        <Form.Label>House Rent Allowance</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.allowanceHouseRent}
                          onChange={this.handleChange}
                          name="allowanceHouseRent"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Medical Allowance</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.allowanceMedical}
                          onChange={this.handleChange}
                          name="allowanceMedical"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Special Allowance</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.allowanceSpecial}
                          onChange={this.handleChange}
                          name="allowanceSpecial"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Fuel Allowance</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.allowanceFuel}
                          onChange={this.handleChange}
                          name="allowanceFuel"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Phone Bill Allowance</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.allowancePhoneBill}
                          onChange={this.handleChange}
                          name="allowancePhoneBill"
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Other Allowance</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.allowanceOther}
                          onChange={this.handleChange}
                          name="allowanceOther"
                        />
                      </Form.Group>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-sm-6">
                <div className="row">
                  <div className="col-sm-12">
                    <Card className="main-card">
                      <Card.Header>Deductions</Card.Header>
                      <Card.Body>
                        <div>
                          <Form.Group>
                            <Form.Label>Tax Deducted at Source</Form.Label>
                            <Form.Control
                              type="text"
                              value={this.state.tds}
                              onChange={this.handleChange}
                              name="tds"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Provident Fund</Form.Label>
                            <Form.Control
                              type="text"
                              value={this.state.pf}
                              onChange={this.handleChange}
                              name="pf"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Professional Tax</Form.Label>
                            <Form.Control
                              type="text"
                              value={this.state.pt}
                              onChange={this.handleChange}
                              name="pt"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Tax Deduction</Form.Label>
                            <Form.Control
                              type="text"
                              value={this.state.deductionTax}
                              onChange={this.handleChange}
                              name="deductionTax"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Other Deduction</Form.Label>
                            <Form.Control
                              type="text"
                              value={this.state.deductionOther}
                              onChange={this.handleChange}
                              name="deductionOther"
                            />
                          </Form.Group>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <Card className="main-card">
                      <Card.Header>Total Salary Details</Card.Header>
                      <Card.Body>
                        <div>
                          <Form.Group>
                            <Form.Label>Gross Salary</Form.Label>
                            <Form.Control
                              type="text"
                              value={salaryGross}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Total Deductions</Form.Label>
                            <Form.Control
                              type="text"
                              value={deductionTotal}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Net Salary</Form.Label>
                            <Form.Control
                              type="text"
                              value={salaryNet}
                              readOnly
                            />
                          </Form.Group>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <div className="row mb-2">
                  <Button type="submit" block>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        ) : null}
      </div>
    );
  }
}
