import React, { Component } from "react";
import { Card, Badge, Button, Form, Modal } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import DeleteModal from "./../DeleteModal";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import API_BASE_URL from "./../../env";
import FileSaver from 'file-saver';
import { Dropdown } from 'react-bootstrap';
import * as XLSX from 'xlsx';



export default class SalaryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      financialInformations: [],
      selectedUser: null,
      editRedirect: false,
      deleteModal: false,
    };
  }

  componentDidMount() {
    axios.defaults.baseURL = API_BASE_URL;
    axios({
      method: "get",
      url: "/api/financialInformations",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        this.setState({ financialInformations: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  

  // handleDownload = (type) => {
  //   axios({
  //     method: "get",
  //     url: `/api/financialInformations/`,
  //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     responseType: 'blob', // Important for binary data
  //   })
  //     .then((response) => {
  //       // Create a blob from the response data
  //       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       const fileName = type === 'monthly' ? 'monthly_report.xlsx' : 'employee_report.xlsx';
  //       FileSaver.saveAs(blob, fileName);
  //     })
  //     .catch((err) => {
  //       console.error("Download error:", err); // Improved error logging
  //     });
  // };
  
  
  handleDownload = (type) => {
    axios({
      method: "get",
      url: `/api/financialInformations/`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((response) => {
      // Extract financial information data
      const financialData = response.data;
  
      // Modify the data to include userId and fullName as separate columns
      const modifiedData = financialData.map(info => {
        return {
          'Full Name': info.user.fullName,   // Add fullName as the second column
          ...info,                           // Include the rest of the data
        };
      });
  
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
  
      // Convert the modified data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(modifiedData);
  
      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
      // Generate a buffer to be saved as an Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
  
      // Create a blob from the buffer
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Generate the file name
      const fileName = type === 'monthly' ? 'monthly_report.xlsx' : 'employee_report.xlsx';
  
      // Use FileSaver to save the file
      FileSaver.saveAs(blob, fileName);
    })
    .catch((err) => {
      console.error("Download error:", err);
    });
  };
  
  
  
  onEdit = (financialInfo) => {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedUser: financialInfo.user, editRedirect: true });
    };
  };

  onView = (user) => {
    return (event) => {
      event.preventDefault();

      this.setState({ selectedUser: user, viewRedirect: true });
    };
  };

  render() {
    const theme = createTheme({
      overrides: {
        MuiTableCell: {
          root: {
            padding: "6px 6px 6px 6px",
          },
        },
      },
    });

    return (
      <div className="container-fluid pt-4">
        {this.state.editRedirect ? (
          <Redirect
            to={{
              pathname: "/salary-details",
              state: { selectedUser: this.state.selectedUser },
            }}
          ></Redirect>
        ) : (
          <></>
        )}
        {this.state.viewRedirect ? (
          <Redirect
            to={{
              pathname: "/salary-view",
              state: { selectedUser: this.state.selectedUser },
            }}
          ></Redirect>
        ) : (
          <></>
        )}
        <div className="col-sm-12">
          <Card>
            {/* <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
              <div className="panel-title">
                <strong>List of Employees and Their Salaries</strong>
              </div>
            </Card.Header> */}
            <Card.Header style={{ backgroundColor: "#515e73", color: "white" }}>
  <div className="d-flex justify-content-between align-items-center">
    <strong>List of Employees and Their Salaries</strong>
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Download Report
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item onClick={() => this.handleDownload('monthly')}>
          Monthly Report
        </Dropdown.Item> */}
        <Dropdown.Item onClick={() => this.handleDownload('employeeWise')}>
          Employee-wise Report
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
</Card.Header>
            <Card.Body>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  columns={[
                    { title: "EMP ID", field: "user.id" },
                    { title: "Full Name", field: "user.fullName" },
                    { title: "Gross Salary", field: "salaryGross" },
                    { title: "Deductions", field: "deductionTotal" },
                    { title: "Net Salary", field: "salaryNet" },
                    { title: "Emp Type", field: "employmentType" },
                    {
                      title: "View",
                      render: (rowData) => (
                        <Form>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={this.onView(rowData)}
                          >
                            <i className="far fa-address-card"></i>
                          </Button>
                        </Form>
                      ),
                    },
                    // {
                    //   title: "Action",
                    //   render: (rowData) => (
                    //     <>
                    //       <Button
                    //         size="sm"
                    //         variant="info"
                    //         className="mr-2"
                    //         onClick={this.onEdit(rowData)}
                    //       >
                    //         <i className="far fa-edit"></i>Edit
                    //       </Button>
                    //     </>
                    //   ),
                    // },
                  ]}
                  data={this.state.financialInformations}
                  options={{
                    rowStyle: (rowData, index) => {
                      if (index % 2) {
                        return { backgroundColor: "#f2f2f2" };
                      }
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 30, 50, 75, 100],
                  }}
                  title="Employees"
                />
              </ThemeProvider>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
